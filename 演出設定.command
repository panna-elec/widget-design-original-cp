#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
echo 'Cyberdeck 演出設定'
/opt/homebrew/bin/python3 - "$ROOT/cyberdeck.widget/lib/preferences.json" <<'PY_CURRENT'
import json,sys
mode=json.load(open(sys.argv[1])).get('motion')
print('現在: '+{'normal':'通常','gentle':'控えめ','off':'オフ'}.get(mode,'不明'))
PY_CURRENT
echo '1: 通常（既定・バッテリー使用時も同じ演出）'
echo '2: 控えめ（背景の光・見出し点滅を停止）'
echo '3: オフ（時計・実測値は更新）'
echo '変更せず閉じる場合はEnterを押してください。'
read -r -p '選択 [1/2/3]: ' choice
case "$choice" in
  1) motion=normal;; 2) motion=gentle;; 3) motion=off;;
  '') exit 0;; *) echo '1〜3を入力してください。変更していません。'; exit 1;;
esac
/opt/homebrew/bin/python3 "$ROOT/scripts/apply-preferences.py" --motion "$motion"
read -r -p 'Enterで閉じます。' unused || true
