#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/Library/Application Support/Übersicht/widgets/cyberdeck.widget"
if [ ! -x /opt/homebrew/bin/sketchybar ]; then
  echo '上部バー用SketchyBarがありません。ウィジェットだけの導入はSETUP.mdを参照してください。'; exit 1
fi
if [ ! -d "$DEST" ]; then bash "$ROOT/scripts/install-widget.sh"; fi
/usr/bin/open "$HOME/Applications/Übersicht.app"
bash "$ROOT/scripts/session-bar.sh" start
/usr/bin/open -b com.apple.systempreferences
echo '時計・システム表示・上部バーを開始しました。このターミナルは閉じて構いません。'
echo '見た目も切り替える場合：壁紙でwallpaper-referenceを選び、外観をダークにしてください。'
echo '壁紙が一覧にない場合は、このフォルダ内のwallpaper-reference.pngを追加してください。'
echo '止めるときは「サイバー表示を停止.command」を開きます。'
