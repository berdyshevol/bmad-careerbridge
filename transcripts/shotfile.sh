#!/bin/bash
# Real Terminal.app screenshot of a rendered file. Usage: shotfile.sh <path> <out.png> [renderfile.py args...]
set -e
P="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; OUT="$2"; shift 2
HERE="$(cd "$(dirname "$0")" && pwd)"
RUN="$(mktemp /tmp/bmad-shot-XXXXXX).sh"
{ printf 'python3 %q %q' "$HERE/renderfile.py" "$P"; for a in "$@"; do printf ' %q' "$a"; done; printf '\n'; } > "$RUN"
FONT_SIZE="${FONT_SIZE:-20}"; W="${W:-1500}"; H="${H:-1000}"
WID=$(osascript <<EOS
tell application "Terminal"
  activate
  set w to do script "bash $RUN"
  delay 0.5
  set font size of front window to $FONT_SIZE
  set bounds of front window to {40, 40, $((40 + W)), $((40 + H))}
  delay 2.5
  return id of front window
end tell
EOS
)
WID=$(echo "$WID" | tr -d '[:space:]')
mkdir -p "$(dirname "$OUT")"
screencapture -x -o -l "$WID" "$OUT"
osascript -e "tell application \"Terminal\" to close (every window whose id is $WID)" >/dev/null 2>&1 || true
rm -f "$RUN"
echo "saved $OUT"
