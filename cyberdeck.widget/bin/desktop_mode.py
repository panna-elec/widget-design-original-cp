"""Reversible wallpaper-view mode. Never moves or removes Desktop files."""
import fcntl,json,os,pathlib,subprocess,sys,tempfile
DIRECTORY=pathlib.Path.home()/'Library/Application Support/Cyberdeck'
DOMAIN='com.apple.finder';KEY='CreateDesktop'
class ModeError(ValueError):pass

def read_preference():
 p=subprocess.run(['/usr/bin/defaults','read',DOMAIN,KEY],capture_output=True,text=True,timeout=3)
 if p.returncode:
  if 'does not exist' in p.stderr:return None
  raise ModeError('デスクトップの表示設定を読めませんでした')
 value=p.stdout.strip().lower()
 if value in ['1','true','yes']:return True
 if value in ['0','false','no']:return False
 raise ModeError('表示設定の形式が不明なため変更しません')
def set_preference(value):
 if value is None:
  if read_preference() is not None:subprocess.run(['/usr/bin/defaults','delete',DOMAIN,KEY],check=True,capture_output=True,timeout=3)
 else:subprocess.run(['/usr/bin/defaults','write',DOMAIN,KEY,'-bool','true' if value else 'false'],check=True,capture_output=True,timeout=3)
def refresh_finder():
 # Graceful termination only. Finder restores its windows; no Apple Events or AX grant.
 p=subprocess.run(['/usr/bin/killall','-TERM','Finder'],capture_output=True,timeout=5)
 if p.returncode not in [0,1]:raise ModeError('Finderを再読み込みできませんでした')
 subprocess.run(['/usr/bin/open','-g','-b','com.apple.finder'],check=True,capture_output=True,timeout=5)
def snapshot(directory):
 p=directory/'desktop-mode.json'
 if not p.exists():return None
 try:
  s=json.loads(p.read_text())
  if s.get('version')!=1 or (s.get('original') is not None and type(s.get('original')) is not bool) or set(s)!={'version','original'}:raise ValueError()
  return s
 except (OSError,ValueError,TypeError):raise ModeError('復元記録を読めません。上書きせず停止しました')
def write_snapshot(directory,original):
 fd,name=tempfile.mkstemp(prefix='.desktop-mode-',dir=directory)
 try:
  with os.fdopen(fd,'w') as f:json.dump(dict(version=1,original=original),f);f.flush();os.fsync(f.fileno())
  os.replace(name,directory/'desktop-mode.json')
 finally:
  if os.path.exists(name):os.unlink(name)
def status(directory=DIRECTORY):
 try:return dict(available=True,hidden=read_preference() is False,owned=snapshot(directory) is not None)
 except (ModeError,OSError,subprocess.SubprocessError):return dict(available=False,hidden=False,owned=False,error='アイコン表示を確認できません')
def change(operation,directory=DIRECTORY):
 if operation not in ['hide','restore']:raise ModeError('未対応の操作です')
 directory.mkdir(parents=True,exist_ok=True,mode=0o700)
 with (directory/'desktop-mode.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX);saved=snapshot(directory);current=read_preference()
  if operation=='hide':
   if saved is None:
    if current is False:return status(directory)
    write_snapshot(directory,current);saved=dict(version=1,original=current)
   try:
    if current is not False:set_preference(False);refresh_finder()
   except (OSError,subprocess.SubprocessError,ModeError) as e:
    # Retain the restoration record if rollback itself fails.
    try:set_preference(saved['original']);refresh_finder();(directory/'desktop-mode.json').unlink(missing_ok=True)
    except Exception:pass
    raise ModeError('切り替えできませんでした。「元の表示へ戻す」を試してください') from e
  elif saved is not None:
   # Respect a user's later change outside this mode instead of overwriting it.
   if current is False:set_preference(saved['original']);refresh_finder()
   (directory/'desktop-mode.json').unlink(missing_ok=True)
  return status(directory)
def main():
 try:
  result=change(sys.argv[1]) if len(sys.argv)==2 else status()
  print(json.dumps({'ok':True,'desktop':result},ensure_ascii=False))
 except (OSError,ValueError,subprocess.SubprocessError):
  print(json.dumps({'ok':False,'error':'表示の復元に失敗しました。鑑賞モードから元へ戻してください。'},ensure_ascii=False));sys.exit(1)
if __name__=='__main__':main()
