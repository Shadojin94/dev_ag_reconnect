#!/usr/bin/env bash
# Captures headless d'une page locale avec Zen Browser, découpées en planches lisibles.
# Usage : capture.sh <fichier.html> [dossier_sortie]
# Variables optionnelles : DESKTOP_H (défaut 6000), MOBILE_H (défaut 9000)
set -euo pipefail

[ $# -ge 1 ] || { echo "Usage : $0 <fichier.html> [dossier_sortie]" >&2; exit 1; }
PAGE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="${2:-$(mktemp -d)}"
DESKTOP_H="${DESKTOP_H:-6000}"
MOBILE_H="${MOBILE_H:-9000}"
ZEN="/Applications/Zen Browser.app/Contents/MacOS/zen"
[ -x "$ZEN" ] || { echo "Zen Browser introuvable : $ZEN" >&2; exit 1; }
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"

# Profil jetable : évite le conflit avec une fenêtre Zen déjà ouverte
shot() {
  local profile
  profile="$(mktemp -d)"
  "$ZEN" --headless --no-remote --profile "$profile" --window-size="$1" --screenshot "$2" "$3" >/dev/null 2>&1
  rm -rf "$profile"
}

# La capture a exactement la taille de la fenêtre : on prend une fenêtre très haute
shot "1440,$DESKTOP_H" "$OUT/desktop.png" "file://$PAGE"
shot "400,$MOBILE_H" "$OUT/mobile.png" "file://$PAGE"

# Découpe via une page HTML qui décale l'image (pas de PIL, et sips --cropOffset est peu fiable)
SLICE=1500
for ((k = 0; k * SLICE < DESKTOP_H; k++)); do
  echo "<body style=\"margin:0\"><div style=\"height:${SLICE}px;overflow:hidden\"><img src=\"desktop.png\" style=\"display:block;margin-top:-$((k * SLICE))px\"></div></body>" > "$OUT/slice.html"
  shot "1440,$SLICE" "$OUT/desktop-$((k + 1)).png" "file://$OUT/slice.html"
done

COL=1800
cols=$(( (MOBILE_H + COL - 1) / COL ))
{
  echo '<body style="margin:0;display:flex;gap:10px;background:#000">'
  for ((k = 0; k < cols; k++)); do
    echo "<div style=\"width:400px;height:${COL}px;overflow:hidden;flex-shrink:0\"><img src=\"mobile.png\" style=\"display:block;margin-top:-$((k * COL))px\"></div>"
  done
  echo '</body>'
} > "$OUT/sheet.html"
shot "$((cols * 410)),$COL" "$OUT/mobile-sheet.png" "file://$OUT/sheet.html"
rm -f "$OUT/slice.html" "$OUT/sheet.html"

ls "$OUT"/desktop-*.png "$OUT/mobile-sheet.png"
