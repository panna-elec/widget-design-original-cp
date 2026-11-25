"""Cyberdeck local state; persists independently of the installed widget folder."""
import base64,copy,fcntl,json,os,pathlib,re,subprocess,sys,tempfile,time
STATE_DIR=pathlib.Path.home()/'Library/Application Support/Cyberdeck'
class StateError(ValueError):pass

def initial():
 return dict(version=1,revision=0,tasks=[],shortcuts=[{'id':'finder','label':'Finder','path':'/System/Library/CoreServices/Finder.app','kind':'app'},{'id':'downloads','label':'Downloads','path':str(pathlib.Path.home()/'Downloads'),'kind':'folder'}],layout={},settings={'batteryEffects':True,'particles':True,'koi':True,'koiPalette':'rose','koiPower':False,'koiSize':100,'koiWeight':100,'low':20,'mid':50,'dock':'auto','reserve':72})
def integer(v,lo,hi):return type(v) is int and lo<=v<=hi
def text(v,limit):return isinstance(v,str) and 0<len(v.strip())<=limit and '\0' not in v
def validate(data):
 if not isinstance(data,dict) or data.get('version')!=1 or not integer(data.get('revision'),0,2**53-1):raise StateError('保存データの形式が不正です')
 out=initial();out['revision']=data['revision']
 for key,limit in [('tasks',100),('shortcuts',24)]:
  items=data.get(key)
  if not isinstance(items,list) or len(items)>limit:raise StateError('登録件数が上限を超えています')
  seen=set();out[key]=[]
  for item in items:
   if not isinstance(item,dict) or not isinstance(item.get('id'),str) or not re.fullmatch(r'[a-zA-Z0-9_-]{1,64}',item['id']) or item['id'] in seen:raise StateError('IDが不正です')
   seen.add(item['id'])
   if key=='tasks':
    if not text(item.get('text'),200) or type(item.get('done')) is not bool:raise StateError('タスクが不正です')
    out[key].append(dict(id=item['id'],text=item['text'].strip(),done=item['done']))
   else:
    if not text(item.get('label'),40) or not text(item.get('path'),2048) or item.get('kind') not in ['app','folder']:raise StateError('ショートカットが不正です')
    path=pathlib.Path(item['path']).expanduser()
    if not path.is_absolute():raise StateError('絶対パスまたは ~/ から始まるパスを入力してください')
    # Revalidate existence/type on launch, so disconnected volumes remain registered.
    out[key].append(dict(id=item['id'],label=item['label'].strip(),path=str(path),kind=item['kind']))
 settings=data.get('settings',{})
 if not isinstance(settings,dict) or any(type(settings.get(k)) is not bool for k in ['particles','batteryEffects']):raise StateError('演出設定が不正です')
 if not integer(settings.get('low'),5,40) or not integer(settings.get('mid'),settings['low']+5,90):raise StateError('残量の境界値が不正です')
 if settings.get('dock') not in ['auto','bottom','left','right'] or not integer(settings.get('reserve'),24,200):raise StateError('Dock余白が不正です')
 if settings.get('koiPalette','rose') not in ['rose','wine','crimson','mauve','coral','cyan'] or type(settings.get('koiPower',False)) is not bool:raise StateError('鯉の配色設定が不正です')
 if type(settings.get('koi',True)) is not bool:raise StateError('鯉の表示設定が不正です')
 for key,choices in [('koiSize',[100,115,130]),('koiWeight',[100,130,160])]:
  if type(settings.get(key,100)) is not int or settings.get(key,100) not in choices:raise StateError('鯉の大きさ・線の太さが不正です')
 out['settings']={k:settings.get(k,out['settings'][k]) for k in out['settings']}
 layout=data.get('layout',{})
 if not isinstance(layout,dict) or len(layout)>20:raise StateError('配置保存数が上限です')
 out['layout']={}
 for key,profile in layout.items():
  if not re.fullmatch(r'[a-zA-Z0-9_-]{1,80}',key) or not isinstance(profile,dict):raise StateError('配置が不正です')
  clean={}
  for name,rect in profile.items():
   if name not in ['clock','system','desk'] or not isinstance(rect,dict):raise StateError('配置対象が不正です')
   if any(not isinstance(rect.get(k),(int,float)) or isinstance(rect.get(k),bool) or not 0<=rect[k]<=1 for k in ['x','y','w','h']):raise StateError('配置寸法が不正です')
   clean[name]={k:rect[k] for k in ['x','y','w','h']}
  out['layout'][key]=clean
 return out

def read_state(directory=STATE_DIR):
 file=directory/'state.json'
 if not file.exists():return initial()
 try:
  if file.stat().st_size>524288:raise StateError('保存データが大きすぎます')
  return validate(json.loads(file.read_text()))
 except (ValueError,OSError,TypeError) as e:raise StateError('保存データを読めません。上書きせず停止しました。') from e

def save_state(data,expected,directory=STATE_DIR):
 clean=validate(data)
 directory.mkdir(parents=True,exist_ok=True,mode=0o700)
 with (directory/'state.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  current=read_state(directory)
  if not integer(expected,0,2**53-1) or current['revision']!=expected:raise StateError('別の画面で更新されました。最新データを確認して再操作してください。')
  clean['revision']=current['revision']+1
  if (directory/'state.json').exists():
   (directory/'state.previous.json').write_text(json.dumps(current,ensure_ascii=False))
   os.chmod(directory/'state.previous.json',0o600)
  fd,temp=tempfile.mkstemp(prefix='.state-',dir=directory)
  try:
   with os.fdopen(fd,'w') as f:json.dump(clean,f,ensure_ascii=False,indent=2);f.flush();os.fsync(f.fileno())
   os.replace(temp,directory/'state.json')
  finally:
   if os.path.exists(temp):os.unlink(temp)
  return clean

def launch(item):
 path=pathlib.Path(item['path']).expanduser().resolve()
 if not path.is_dir():raise StateError('アプリまたはフォルダーが見つかりません')
 if item['kind']=='app':
  if path.suffix!='.app' or not (path/'Contents/Info.plist').is_file():raise StateError('.appのパスを指定してください')
  args=['/usr/bin/open','-a',str(path)]
 else:
  if path.suffix=='.app':raise StateError('アプリは種類を「アプリ」にしてください')
  args=['/usr/bin/open','--',str(path)]
 subprocess.run(args,check=True,timeout=10,capture_output=True)

def main():
 try:
  if len(sys.argv)!=2 or len(sys.argv[1])>750000:raise StateError('要求が不正です')
  request=json.loads(base64.b64decode(sys.argv[1],validate=True))
  if request.get('action')=='save':state=save_state(request.get('state'),request.get('expected'));response={'ok':True,'state':state}
  elif request.get('action')=='desktop-mode':
   from desktop_mode import change,ModeError
   try:response={'ok':True,'desktop':change(request.get('operation'))}
   except ModeError as e:raise StateError(str(e)) from e
  elif request.get('action')=='launch':
   state=read_state();item=next((i for i in state['shortcuts'] if i['id']==request.get('id')),None)
   if not item:raise StateError('登録されていないショートカットです')
   launch(item);response={'ok':True}
  else:raise StateError('未対応の操作です')
 except (ValueError,TypeError,KeyError,OSError,subprocess.SubprocessError) as e:
  response={'ok':False,'error':str(e) if isinstance(e,StateError) else '操作できませんでした。入力や保存先を確認してください。'}
 print(json.dumps(response,ensure_ascii=False))
if __name__=='__main__':main()
