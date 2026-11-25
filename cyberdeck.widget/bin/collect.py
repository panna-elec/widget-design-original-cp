#!/usr/bin/env python3
import json,pathlib,subprocess
from desk_store import read_state,StateError
from desktop_mode import status as desktop_status
try:
 stats=json.loads(subprocess.check_output([str(pathlib.Path(__file__).with_name('stats'))],timeout=4,text=True))
except (OSError,ValueError,subprocess.SubprocessError):stats={'metricsError':True}
try:stats['desk']=read_state()
except StateError as e:stats['deskError']=str(e)
stats['desktop']=desktop_status()
print(json.dumps(stats,ensure_ascii=False))
