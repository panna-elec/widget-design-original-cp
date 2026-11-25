#!/bin/bash
set -eu
BAR=/opt/homebrew/bin/sketchybar
BAR_DIR="$(cd "$(dirname "$0")" && pwd)"
case "${1:-}" in
  power)
    label="$(/opt/homebrew/bin/python3 "$BAR_DIR/power-status.py" 2>/dev/null)" || label='取得待ち'
    [ -n "$label" ] || label='取得待ち'
    "$BAR" --set cyberdeck.power label="$label" label.color=0xfff75049
    ;;
  *) exit 2;;
esac
