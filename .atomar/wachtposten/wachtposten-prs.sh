#!/bin/zsh
# atomar-posten: verfahren
# Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
# Wachtposten G — offene PRs, sobald sie da sind.
#
# Joachim, 06.09.2026: „Bring das auf main, wenn es durch ist — muss ich ja
# eigentlich nicht sagen. Ich will so schnell wie moeglich draufschauen."
#
# Er hat es an diesem Tag DREIMAL gesagt. Die Regel dazu gibt es (Rang 42),
# das Schaufenster auf 3100 auch — was fehlte, war der Verteiler: Er hat
# gemergt, wenn eine Sitzung ihm eine Nachricht schrieb, und die Nachricht
# kam, wenn sie fertig gemeldet hat. Zwischen „gruen" und „auf main" lag
# also seine Antwortzeit, nicht die Arbeit.
#
# Dieser Posten meldet einen offenen PR, sobald es ihn gibt. Entwuerfe
# NICHT -- ein Entwurf sagt ausdruecklich „noch nicht".
#
# GEGENPROBE: Findet er die Liste gar nicht (kein `gh`, kein Netz), bricht
# er mit Fehler ab statt still zu bleiben. Ein Posten, der schweigt, weil er
# nichts sieht, ist von einem ohne Befund nicht zu unterscheiden.
# Die Wurzel wird HERGELEITET, nicht getippt: dieser Posten liegt in
# <wurzel>/.atomar/wachtposten/. Ein fest verdrahteter Pfad macht ihn
# fuer jedes andere Projekt unbrauchbar (T-131).
W=${ATOMAR_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}
Z="$(dirname $0)/.stand-prs"
touch "$Z"
cd $W || exit 2
# ANLAUF VOR DEM EINTRITT IN DIE SCHLEIFE (T-131). Eine Schleife kehrt nie
# zurueck -- die Bedingung "Exit ungleich 0, wenn eine Voraussetzung fehlt"
# laesst sich also nur HIER pruefen, vor dem `while`. Ohne das lief ein
# Posten in einem Projekt ohne `origin` ewig ueber ein leeres Verzeichnis
# und meldete nie etwas: von aussen nicht von einem stillen Bestand zu
# unterscheiden.
. "$(dirname "$0")/_anlauf.sh"
anlauf_braucht_origin

while true; do
  liste=$(gh pr list --state open --json number,title,isDraft \
            --jq '.[] | select(.isDraft == false) | "\(.number)\t\(.title)"' 2>/dev/null)
  if [ $? -ne 0 ]; then
    echo "FEHLER: gh pr list ging nicht -- der Posten sieht nichts und schweigt deshalb nicht."
    exit 2
  fi
  echo "$liste" | while IFS=$'\t' read -r nr titel; do
    [ -z "$nr" ] && continue
    if ! grep -q "^$nr\$" "$Z"; then
      echo "PR OFFEN · #$nr · $titel"
      echo "$nr" >> "$Z"
    fi
  done
  sleep 120
done
