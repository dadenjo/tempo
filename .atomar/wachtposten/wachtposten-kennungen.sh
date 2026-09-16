#!/bin/zsh
# atomar-posten: verfahren
# Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
# Wachtposten F — Kennungen, die benutzt statt vergeben wurden.
# Meldet nur Aenderungen gegenueber dem letzten Lauf; siehe
# pruefe-kennungen.mjs fuer die Begruendung und fuer seine Grenze.
# Die Wurzel wird HERGELEITET, nicht getippt: dieser Posten liegt in
# <wurzel>/.atomar/wachtposten/. Ein fest verdrahteter Pfad macht ihn
# fuer jedes andere Projekt unbrauchbar (T-131).
W=${ATOMAR_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}
Z="$(dirname $0)/.stand-kennungen"
touch "$Z"
# ANLAUF VOR DEM EINTRITT IN DIE SCHLEIFE (T-131). Eine Schleife kehrt nie
# zurueck -- die Bedingung "Exit ungleich 0, wenn eine Voraussetzung fehlt"
# laesst sich also nur HIER pruefen, vor dem `while`. Ohne das lief ein
# Posten in einem Projekt ohne `origin` ewig ueber ein leeres Verzeichnis
# und meldete nie etwas: von aussen nicht von einem stillen Bestand zu
# unterscheiden.
. "$(dirname "$0")/_anlauf.sh"
anlauf_braucht_origin

while true; do
  neu=$(node $W/.atomar/wachtposten/pruefe-kennungen.mjs 2>&1)
  if [ "$neu" != "$(cat $Z)" ]; then
    echo "$neu"
    echo "$neu" > "$Z"
  fi
  sleep 1200
done
