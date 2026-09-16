# DER ANLAUF EINES POSTENS, fuer die Schalskripte (T-131).
#
# Die Begruendung steht in _anlauf.mjs. Kurz: drei Zustaende, drei Zahlen --
# 0 in Ordnung, 1 BEFUND, 2 KONNTE NICHT LAUFEN. `zahlen.sh` gab am
# 10.09.2026 in einem Projekt ohne `origin` einen vollstaendigen Bericht aus
# Nullen zurueck und endete mit 0. Ein Projekt, das nicht messbar war, sah
# damit aus wie eines ohne Regeln.

anlauf_abbruch() {
  echo "KONNTE NICHT LAUFEN · $1" >&2
  [ -n "$2" ] && echo "  $2" >&2
  exit 2
}

# Verlangt einen git-Baum mit origin/main. Nennt, was FEHLT -- nicht gits
# eigenen Text, der die Voraussetzung verschweigt.
anlauf_braucht_origin() {
  git rev-parse --git-dir >/dev/null 2>&1 \
    || anlauf_abbruch "kein git-Verzeichnis" "Dieser Posten misst gegen origin/main."
  git rev-parse --verify origin/main >/dev/null 2>&1 \
    || anlauf_abbruch "kein \`origin/main\`" "Dieser Posten misst gegen origin/main — ohne den Anker misst er nichts."
}
