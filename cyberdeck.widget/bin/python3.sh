#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Resolve Python without relying on the shell environment inherited by Übersicht.
set -euo pipefail
candidates=()
if [[ -n "${CYBERDECK_PYTHON:-}" ]]; then
  candidates+=("$CYBERDECK_PYTHON")
else
  candidates+=(/opt/homebrew/bin/python3 /usr/local/bin/python3)
  found="$(command -v python3 || true)"
  [[ -z "$found" || "$found" == /usr/bin/python3 ]] || candidates+=("$found")
fi
for candidate in "${candidates[@]}"; do
  [[ "$candidate" == /* && -x "$candidate" && ! -d "$candidate" ]] || continue
  if "$candidate" -c 'import sys; sys.exit(sys.version_info < (3,10))' >/dev/null 2>&1; then
    export PYTHONDONTWRITEBYTECODE=1
    exec "$candidate" "$@"
  fi
done
printf '%s\n' 'Python 3.10+ not found. Install Python from python.org or Homebrew; see INSTALL.md / INSTALL.ja.md.' >&2
exit 1
