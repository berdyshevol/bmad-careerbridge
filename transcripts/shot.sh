#!/bin/bash
# Real Terminal.app screenshot of one saved turn.
# Usage: shot.sh <step> <turn NN> <out.png> [render.py extra args...]
set -e
STEP="$1"; TURN="$2"; OUT="$3"; shift 3
HERE="$(cd "$(dirname "$0")" && pwd)"
RUN="$(mktemp /tmp/bmad-shot-XXXXXX).sh"
{ printf 'python3 %q %q %q' "$HERE/render.py" "$STEP" "$TURN"; for a in "$@"; do printf ' %q' "$a"; done; printf '\n'; } > "$RUN"
FONT_SIZE="${FONT_SIZE:-20}"
PROFILE="${PROFILE:-Basic}"
W="${W:-1500}"; H="${H:-1000}"

WID=$(osascript <<EOF
tell application "Terminal"
  activate
  set w to do script "bash $RUN"
  delay 0.5
  set current settings of front window to settings set "$PROFILE"
  set font size of front window to $FONT_SIZE
  set bounds of front window to {40, 40, $((40 + W)), $((40 + H))}
  delay 2.5
  return id of front window
end tell
EOF
)
WID=$(echo "$WID" | tr -d '[:space:]')
mkdir -p "$(dirname "$OUT")"
screencapture -x -o -l "$WID" "$OUT"
osascript -e "tell application \"Terminal\" to close (every window whose id is $WID)" >/dev/null 2>&1 || true
rm -f "$RUN"
echo "saved $OUT ($(sips -g pixelWidth -g pixelHeight "$OUT" 2>/dev/null | awk '/pixel/ {printf "%s ", $2}'))"
