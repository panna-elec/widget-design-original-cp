#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
command -v pandoc >/dev/null || { echo 'Pandoc is needed only to rebuild the HTML manuals.' >&2; exit 1; }
for language in en ja; do
  if [[ "$language" == en ]]; then input=INSTALL.md; output=INSTALL.html; title='Widget Design — Installation'; else input=INSTALL.ja.md; output=INSTALL.ja.html; title='Widget Design — 導入マニュアル'; fi
  pandoc "$input" --from=gfm --to=html5 --standalone --toc --toc-depth=2 --template=docs/manual/template.html --lua-filter=scripts/manual-links.lua --metadata="lang:$language" --metadata="title:$title" --output="$output"
done
