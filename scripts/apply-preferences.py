#!/usr/bin/env python3
"""Save validated choices for the next ON and update an installed widget, if any."""
import argparse, datetime, json, pathlib, shutil
ALLOWED={'style':['reference','cyber','clean'],'palette':['cyan','coral','quiet'],'layout':['split','left'],'motion':['normal','gentle','off']}
def validate(data):
    clean=dict(data,style=data.get('style','clean'))
    if clean.get('version')!=1 or any(clean.get(k) not in v for k,v in ALLOWED.items()):
        raise ValueError('設定ファイルの形式または値が不正です。変更しません。')
    return dict(version=1,**{k:clean[k] for k in ALLOWED})
def save(data, root, installed):
    clean=validate(data)
    source=root/'cyberdeck.widget/lib/preferences.json'
    targets=[source]+([installed] if installed.exists() else [])
    backup=root/'backups'/('preferences-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f'))
    backup.mkdir(parents=True)
    original={p:p.read_bytes() for p in targets}
    staged=[]
    try:
        for i,p in enumerate(targets):
            shutil.copy2(p,backup/('saved.json' if i==0 else 'installed.json'))
            tmp=p.with_suffix('.json.tmp');tmp.write_text(json.dumps(clean,ensure_ascii=False,indent=2)+'\n');staged.append((tmp,p))
        for tmp,p in staged:tmp.replace(p)
    except Exception:
        for p,content in original.items():p.write_bytes(content)
        raise
    finally:
        for tmp,_ in staged:tmp.unlink(missing_ok=True)
    return clean

def main():
    parser=argparse.ArgumentParser()
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument('file',nargs='?');group.add_argument('--motion',choices=ALLOWED['motion'])
    args=parser.parse_args()
    root=pathlib.Path(__file__).resolve().parent.parent
    source=root/'cyberdeck.widget/lib/preferences.json'
    data=json.loads(pathlib.Path(args.file).read_text() if args.file else source.read_text())
    if args.motion:data['motion']=args.motion
    installed=pathlib.Path.home()/'Library/Application Support/Übersicht/widgets/cyberdeck.widget/lib/preferences.json'
    result=save(data,root,installed)
    print('演出設定: '+{'normal':'通常（電源接続・バッテリー共通）','gentle':'控えめ','off':'オフ'}[result['motion']])
    print('保存しました。表示中なら自動反映し、停止中なら次回ONで使用します。')
if __name__=='__main__':main()
