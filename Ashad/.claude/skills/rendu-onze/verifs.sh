#!/usr/bin/env bash
# Contrôles de cohérence sur la page ONZE, avant ou après une retouche.
# Usage : bash verifs.sh [dossier-du-projet]
# Par défaut, le projet qui contient ce skill — donc lançable de n'importe où.
set -uo pipefail

PROJET="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)}"
HTML="$PROJET/index.html"
JS="$PROJET/assets/app.js"
CSS="$PROJET/assets/styles.css"
echec=0

for f in "$HTML" "$JS" "$CSS"; do
  [ -f "$f" ] || { echo "MANQUANT  $f"; echec=1; }
done
[ "$echec" -eq 1 ] && exit 1

if node --check "$JS" 2>/dev/null; then echo "OK        $JS analysé sans erreur"
else echo "ÉCHEC     $JS"; node --check "$JS"; echec=1; fi

python3 - "$HTML" <<'PY' || echec=1
import html.parser, sys, pathlib
VIDES = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}
class Verif(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.pile=[]; self.erreurs=[]
    def handle_starttag(self, t, a):
        if t not in VIDES: self.pile.append(t)
    def handle_endtag(self, t):
        if self.pile and self.pile[-1] == t: self.pile.pop()
        else: self.erreurs.append(f"</{t}> inattendu, pile : {self.pile[-3:]}")
chemin = sys.argv[1]
v = Verif(); v.feed(pathlib.Path(chemin).read_text(encoding='utf-8'))
if v.erreurs or v.pile:
    print(f"ÉCHEC     {chemin} : {(v.erreurs or ['balises non fermées : ' + ', '.join(v.pile)])[0]}")
    sys.exit(1)
print(f"OK        {chemin} : balises équilibrées")
PY

python3 - "$CSS" <<'PY' || echec=1
import sys, pathlib
chemin = sys.argv[1]
s = pathlib.Path(chemin).read_text(encoding='utf-8')
o, f = s.count('{'), s.count('}')
if o != f:
    print(f"ÉCHEC     {chemin} : {o} accolades ouvrantes pour {f} fermantes")
    sys.exit(1)
print(f"OK        {chemin} : {o} blocs équilibrés")
PY

exit "$echec"
