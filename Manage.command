#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
if [[ $# -eq 0 ]]; then
  printf '%s\n' 'Widget Design — local package manager / 配布版の管理' '1) Check / 確認のみ' '2) Install / 新規導入' '3) Update / バックアップして更新' '4) Disable / 退避して停止' '5) Restore / バックアップから復元'
  read -r -p '> ' choice
  case "$choice" in
    1) set -- check;; 2) set -- install;; 3) set -- update;; 4) set -- disable;;
    5) read -r -p 'Backup ID: ' ident; set -- restore --backup-id "$ident";;
    *) printf '%s\n' 'Cancelled / 中止'; exit 1;;
  esac
  if /bin/bash "$ROOT/cyberdeck.widget/bin/python3.sh" "$ROOT/scripts/manage-distribution.py" "$@"; then result=0; else result=$?; fi
  read -r -p 'Press Return to close / Returnで終了' unused
  exit "$result"
fi
exec /bin/bash "$ROOT/cyberdeck.widget/bin/python3.sh" "$ROOT/scripts/manage-distribution.py" "$@"
