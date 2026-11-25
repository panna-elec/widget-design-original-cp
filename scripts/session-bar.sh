#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="gui/$(id -u)"
LABEL=local.cyberdeck.reference.bar
PLIST="$ROOT/runtime/$LABEL.plist"
case "${1:-}" in
  start)
    if /bin/launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then exit 0; fi
    if /usr/bin/pgrep -x sketchybar >/dev/null; then
      echo '別のSketchyBarが起動しています。停止せず終了します。'; exit 1
    fi
    mkdir -p "$ROOT/runtime"
    /opt/homebrew/bin/python3 - "$ROOT" "$PLIST" "$LABEL" <<'PY'
import sys,plistlib
from pathlib import Path
root,filename,label=sys.argv[1:]
data={'Label':label,'ProgramArguments':['/opt/homebrew/bin/sketchybar','--config',root+'/sketchybar/sketchybarrc'],'RunAtLoad':True,'StandardOutPath':root+'/runtime/bar-session.log','StandardErrorPath':root+'/runtime/bar-session.log'}
Path(filename).write_bytes(plistlib.dumps(data))
PY
    /bin/launchctl bootstrap "$DOMAIN" "$PLIST"
    ;;
  stop)
    if /bin/launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then
      /bin/launchctl bootout "$DOMAIN/$LABEL"
    fi
    if /usr/bin/pgrep -x sketchybar >/dev/null; then
      bash "$ROOT/scripts/stop-bar.sh"
    fi
    ;;
  *) echo 'usage: session-bar.sh start|stop'; exit 2;;
esac
