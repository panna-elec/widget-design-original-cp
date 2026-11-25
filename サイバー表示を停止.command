#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
bash "$ROOT/scripts/session-bar.sh" stop
bash "$ROOT/scripts/disable-widget.sh"
/usr/bin/open -b com.apple.systempreferences
echo '追加した時計・システム表示・上部バーを停止しました。設定は保存されています。'
echo '元の見た目に戻す場合：壁紙・外観は変更前に控えた設定を選んでください。'
echo 'Übersichtも終了したい場合は、アプリのメニューからQuit Übersichtを選んでください。'
