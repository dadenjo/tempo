#!/bin/zsh
# atomar-posten: verfahren
# Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
# DIE ZAHLEN, DIE ICH SONST TIPPE.
#
# Der Anlass, 06.09.2026: Der Verteiler hat DREIMAL in einer Nacht dieselbe
# Zahl falsch genannt (Regelanzahl), jedes Mal durch FORTSCHREIBEN statt
# Zaehlen — und einmal in genau der Nachricht, in der er erklaerte, warum
# eine fortgeschriebene Zahl ein getippter Wert mit einem Beleg von gestern
# ist.
#
# Eine Regel dagegen gibt es (Rang 44). Sie hat nicht gereicht: Sie verlangt
# einen Handgriff in dem Moment, in dem man sicher ist, ihn nicht zu
# brauchen. Deshalb hier die eine Stelle, aus der die Zahlen kommen.
#
# NENNT IMMER DIE QUELLE, damit die Zahl ihre Frage mitbringt — sonst ist
# sie keine Kontrollzahl, sondern nur richtig.
# Die Wurzel wird HERGELEITET, nicht getippt: dieser Posten liegt in
# <wurzel>/.atomar/wachtposten/. Ein fest verdrahteter Pfad macht ihn
# fuer jedes andere Projekt unbrauchbar (T-131).
W=${ATOMAR_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}
cd $W || exit 2

# ANLAUF VOR DER MESSUNG (T-131). Ohne diese Zeile lief der Posten am
# 10.09.2026 in einem Projekt ohne `origin` glatt durch und druckte einen
# vollstaendigen Bericht aus Nullen -- Exit 0. Jedes `2>/dev/null` weiter
# unten schluckt seinen eigenen Fehlschlag, und `ls` auf ein leeres
# Verzeichnis zaehlt 0 wie jede andere Null auch. Ein Projekt, das nicht
# messbar war, sah damit aus wie eines ohne Regeln.
. "$(dirname "$0")/_anlauf.sh"
anlauf_braucht_origin

git fetch origin -q 2>/dev/null

TMPR=$(mktemp -d) || exit 2
git archive origin/main .atomar/rules 2>/dev/null | tar -x -C "$TMPR" 2>/dev/null
echo "REGELN (origin/main)"
echo "  Dateien:            $(ls $TMPR/.atomar/rules/*.md 2>/dev/null | wc -l | tr -d ' ')"
echo "  davon bis Rang 100: $(grep -l '^rank: \([0-9]\|[1-9][0-9]\|100\)$' $TMPR/.atomar/rules/*.md 2>/dev/null | wc -l | tr -d ' ')"
echo "  Zeichen bis Rang 100: $(grep -l '^rank: \([0-9]\|[1-9][0-9]\|100\)$' $TMPR/.atomar/rules/*.md 2>/dev/null | xargs cat 2>/dev/null | wc -c | tr -d ' ')"
rm -rf "$TMPR"

# DIE EINTRAEGE KOMMEN AUS origin/main, NICHT AUS DEM ARBEITSBAUM.
# Erste Fassung zaehlte den Baum — und meldete zwei `umgesetzt`, wo auf
# `main` fuenf standen: Der Baum liegt fast zweihundert Commits zurueck.
# Ein Werkzeug gegen fortgeschriebene Zahlen, das selbst eine veraltete
# Quelle liest, ist der Fehler mit einem Deckel drauf.
TMP=$(mktemp -d) || exit 2
git archive origin/main .atomar/backlog 2>/dev/null | tar -x -C "$TMP" 2>/dev/null
echo "EINTRAEGE (origin/main)"
for s in open active waiting umgesetzt done parked; do
  n=$(grep -l "^status: $s\$" $TMP/.atomar/backlog/*.md 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -gt 0 ] && printf "  %-10s %s\n" "$s" "$n"
done
echo "  bei Joachim, offen: $(grep -l '^owner: Joachim$' $TMP/.atomar/backlog/*.md 2>/dev/null | xargs grep -L '^status: \(done\|closed\)$' 2>/dev/null | wc -l | tr -d ' ')"
rm -rf "$TMP"

echo "KENNUNGEN"
echo "  hoechste lokal:     T-$(ls .atomar/backlog/T-*.md 2>/dev/null | sed 's/.*T-//;s/\.md//' | sort -n | tail -1)   (Arbeitsbaum, kann zurueckliegen)"
echo "  hoechste auf main:  T-$(git ls-tree --name-only origin/main .atomar/backlog/ 2>/dev/null | grep -o 'T-[0-9]*' | sed 's/T-//' | sort -n | tail -1)"

echo "BAUM"
echo "  Rueckstand:         $(git rev-list --count HEAD..origin/main 2>/dev/null) Commits hinter origin/main"
