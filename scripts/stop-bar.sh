#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/runtime/sketchybar.pid"
if [ ! -f "$PID_FILE" ]; then echo '起動記録がありません。'; exit 0; fi
bar_pid="$(cat "$PID_FILE")"
case "$bar_pid" in ''|*[!0-9]*) echo '無効な起動記録です。'; exit 1;; esac
bar_command="$(/bin/ps -p "$bar_pid" -o command= || true)"
if [ "$bar_command" = "/opt/homebrew/bin/sketchybar --config $ROOT/sketchybar/sketchybarrc" ]; then
  kill "$bar_pid"
  echo 'Cyberdeck上部バーを停止しました。'
else
  echo '対象プロセスが一致しないため、停止操作はしていません。'
fi
