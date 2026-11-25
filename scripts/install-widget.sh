#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/Library/Application Support/Übersicht/widgets/cyberdeck.widget"
if [ -e "$DEST" ]; then
  echo '既存のcyberdeck.widgetがあります。上書きせず終了します。'
  exit 1
fi
if [ ! -x "$ROOT/cyberdeck.widget/bin/stats" ]; then
  echo 'statsバイナリがありません。native/Stats.swiftをswiftcでビルドしてください。'
  exit 1
fi
mkdir -p "$(dirname "$DEST")"
ditto "$ROOT/cyberdeck.widget" "$DEST"
echo 'Cyberdeckウィジェットを配置しました。ÜbersichtでRefresh all Widgetsを実行してください。'
