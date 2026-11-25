#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if /usr/bin/pgrep -x sketchybar >/dev/null; then
  echo 'SketchyBarは起動済みです。既存のバーを変更せず終了します。'
  exit 0
fi
mkdir -p "$ROOT/runtime"
echo $$ > "$ROOT/runtime/sketchybar.pid"
echo 'Cyberdeck上部バーを起動します。このターミナルは開いたままにしてください。停止はCtrl+Cです。'
exec /opt/homebrew/bin/sketchybar --config "$ROOT/sketchybar/sketchybarrc"
