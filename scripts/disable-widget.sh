#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$HOME/Library/Application Support/Übersicht/widgets/cyberdeck.widget"
BACKUP="$ROOT/backups/cyberdeck.widget-$(date +%Y%m%d-%H%M%S)"
# Restore only the icon preference captured by our viewing mode.
/bin/bash "$ROOT/cyberdeck.widget/bin/python3.sh" "$ROOT/cyberdeck.widget/bin/desktop_mode.py" restore
if [ ! -d "$SOURCE" ]; then echo 'Cyberdeckは配置されていません。'; exit 0; fi
mkdir -p "$ROOT/backups"
if [ -e "$BACKUP" ]; then echo '同名のバックアップがあります。'; exit 1; fi
mv "$SOURCE" "$BACKUP"
echo 'Cyberdeckだけを退避して停止しました。ほかのウィジェットは変更していません。'
