#!/usr/bin/env python3
"""Read a fresh macOS power snapshot; never reuse a previous percentage."""
import json, os, re, subprocess, sys

def parse_power(text):
    source = re.search(r"Now drawing from '(AC Power|Battery Power|UPS Power)'", text)
    battery = re.search(r'InternalBattery[^\n]*?\s(\d{1,3})%;\s*([^;\n]+)', text)
    if not source or not battery or not 0 <= int(battery[1]) <= 100:
        return {'state':'unknown','percent':None,'label':'取得待ち'}
    percent, detail = int(battery[1]), battery[2].strip().lower()
    supply=source[1]
    if detail == 'discharging':
        state, title = ('battery','電池') if supply=='Battery Power' else ('external-discharging','放電')
    elif supply=='AC Power' and detail=='charging': state,title='charging','充電'
    elif supply=='AC Power' and detail=='charged': state,title='charged','満充電'
    elif supply=='AC Power' and detail in ('not charging','finishing charge'): state,title='external','電源'
    else: return {'state':'unknown','percent':None,'label':'取得待ち'}
    return {'state':state,'percent':percent,'label':f'{title} {percent}%'}

def read_power():
    try:
        result=subprocess.run(['/usr/bin/pmset','-g','batt'],capture_output=True,text=True,timeout=4,check=True,env={**os.environ,'LC_ALL':'C'})
        return parse_power(result.stdout)
    except (OSError,subprocess.SubprocessError):
        return {'state':'unknown','percent':None,'label':'取得待ち'}

if __name__=='__main__':
    data=read_power()
    print(json.dumps(data,ensure_ascii=False) if '--json' in sys.argv[1:] else data['label'])
