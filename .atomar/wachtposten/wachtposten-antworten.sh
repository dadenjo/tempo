#!/bin/zsh
# atomar-posten: verfahren
# Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
# Wachtposten A — meldet ANTWORTEN VON JOACHIM und Statuswechsel im Backlog.
#
# WICHTIG (05.09.2026, Rang 25): Der Posten prueft den URHEBER, nicht die
# Anwesenheit eines `answer:`-Feldes. Eine Antwort, die eine SITZUNG
# nachgetragen hat, fuellt dasselbe Feld — und ein Posten auf die Anwesenheit
# erteilt damit die Freigabe, die er bewachen soll.
#
# Und das Muster ist am ZEILENANFANG VERANKERT. Frei gesucht trifft es die
# Logzeilen, die es erklaeren — auch diesen Kommentar. Gemessen ueber vier
# Eintraege: frei 1/1/1/1, verankert 1/1/1/0. Nur die verankerte Fassung
# unterscheidet.
#
# WARUM DIESER POSTEN DEN ARBEITSBAUM LIEST — UND NICHT origin/main
#
# Am 06.09.2026 wurden die Posten B und E auf `origin/main` umgestellt,
# weil der gemeinsame Arbeitsbaum 197 Commits zurücklag und sie deshalb
# veraltete Zustände meldeten. Dieser Posten hier darf NICHT mitwandern.
#
# Er sucht Joachims Antworten. Joachim antwortet in der ANSICHT, und die
# schreibt in den Arbeitsbaum — nicht auf `origin/main`. Zwischen seiner
# Antwort und ihrer Veröffentlichung liegt jemand, der sie pusht.
#
# Wer diesen Posten auf `origin/main` umstellt, macht ihn genau an der
# Stelle blind, für die es ihn gibt: Er meldete eine Freigabe erst,
# nachdem eine Sitzung sie mitgenommen hat — also nach dem Moment, in
# dem sie gebraucht wird.

# Hergeleitet, nicht getippt (T-131).
W=${ATOMAR_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}
B=$W/.atomar/backlog
Z="$(dirname $0)/.stand-antworten"
# DIE HERKUNFT IN KLAMMERN GEHOERT DAZU — gemessen 07.09.2026.
#
# Die Ansicht schreibt seit einiger Zeit `· Joachim [Ansicht] · answered:`.
# Das alte Muster verlangte `· Joachim ·` und traf davon KEINE einzige. Vier
# Antworten von Joachim an einem Tag fielen deshalb durch auf die harmlose
# Zeile „backlog bewegt", und der Verteiler hat sie zwischen seinen eigenen
# Statuswechseln nicht gesehen — die laengste lag zweieinhalb Stunden.
#
# Gezaehlt an dem Tag: 33 Eintraege im alten Format, 13 im neuen. Deshalb hat
# die Gegenprobe unten weiter GRUEN gemeldet: Sie zaehlte die Vergangenheit.
# Eine Pruefung, die nur Altbestand misst, kann eine Formataenderung nicht
# bemerken — sie ist genau die Pruefung, die nicht scheitern kann.
MUSTER='^- [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:]+Z · Joachim( \[[^]]+\])? · answered:'

schnappschuss() {
  for f in $B/*.md; do
    id=${f:t:r}
    st=$(grep -m1 '^status:' $f | sed 's/status: *//')
    jo=$(grep -cE "$MUSTER" $f)          # ECHTE Ansicht-Antwort von Joachim
    ow=$(grep -m1 '^owner:' $f | sed 's/owner: *//')
    echo "$id|$st|$jo|$ow"
  done
}
# Gegenprobe: findet das Muster ueberhaupt etwas? Sonst ist der Posten
# immer still und sieht dabei aus wie Geduld.
treffer=$(grep -lE "$MUSTER" $B/*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$treffer" -lt 3 ]; then
  echo "WACHTPOSTEN A BRICHT AB: das verankerte Muster findet nur $treffer Eintraege (erwartet >= 3). Entweder hat sich das Format geaendert oder der Posten bewacht nichts."
  # EXIT 2, NICHT 1 (T-131): "der Posten bewacht nichts" ist kein BEFUND
  # ueber den Bestand, sondern ein gescheiterter Anlauf. Mit 1 waere er von
  # einem echten Fund nicht zu unterscheiden — und beide saehen aus wie
  # "die Wache hat gearbeitet".
  exit 2
fi

# UND DIE GEGENPROBE, DIE SCHEITERN KANN: Trifft das Muster auch die JUENGSTE
# Antwort im Bestand? Die Zaehlung darueber misst die Vergangenheit und bleibt
# gruen, waehrend ein neues Format schon durchfaellt — genau so ist dieser
# Posten am 07.09. blind geworden, ohne es zu melden.
# UND DIESE SUCHE IST EBENFALLS VERANKERT — dieselbe Falle, eine Funktion
# tiefer. Der erste Wurf suchte frei nach '· answered:' und traf die LOGZEILE,
# die diese Pruefung beschreibt: Der Posten brach beim ersten Start ab und
# zeigte auf meinen eigenen Kommentar. Die Warnung dazu stand seit Mai in
# dieser Datei, drei Absaetze weiter oben.
#
# Gesucht wird deshalb nach dem AUFBAU einer Antwortzeile — Datum, Urheber,
# 'answered:' —, und geprueft wird nur, wenn der Urheber Joachim ist. Eine
# Antwort, die eine Sitzung nachgetragen hat, geht diesen Posten nichts an.
KANDIDAT='^- [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:]+Z · [^·]*Joachim[^·]* · answered:'
juengste=$(grep -hE "$KANDIDAT" $B/*.md 2>/dev/null | sort | tail -1)
if [ -n "$juengste" ] && ! echo "$juengste" | grep -qE "$MUSTER"; then
  echo "WACHTPOSTEN A BRICHT AB: die juengste Antwort im Bestand passt NICHT auf das Muster —"
  echo "  $juengste"
  echo "  Das Format hat sich geaendert. Der Posten wuerde ab jetzt jede Antwort als blosse"
  echo "  Bewegung melden, statt sie zu nennen. Muster anpassen, nicht die Pruefung entfernen."
  exit 2  # siehe oben: gescheiterter Anlauf, kein Befund
fi
echo "WACHTPOSTEN A laeuft · verankertes Muster · Gegenprobe: $treffer Eintraege mit echter Ansicht-Antwort"
[ -f "$Z" ] || schnappschuss > "$Z"
# ANLAUF VOR DEM EINTRITT IN DIE SCHLEIFE (T-131). Eine Schleife kehrt nie
# zurueck -- die Bedingung "Exit ungleich 0, wenn eine Voraussetzung fehlt"
# laesst sich also nur HIER pruefen, vor dem `while`. Ohne das lief ein
# Posten in einem Projekt ohne `origin` ewig ueber ein leeres Verzeichnis
# und meldete nie etwas: von aussen nicht von einem stillen Bestand zu
# unterscheiden.
. "$(dirname "$0")/_anlauf.sh"
anlauf_braucht_origin

while true; do
  schnappschuss > "$Z.neu"
  diff "$Z" "$Z.neu" 2>/dev/null | grep '^>' | while IFS='|' read -r a st jo ow; do
    id=${a#> }
    alt=$(grep "^$id|" "$Z")
    altjo=$(echo "$alt" | cut -d'|' -f3)
    if [ "$jo" -gt "${altjo:-0}" ]; then
      echo "ANTWORT VON JOACHIM (verankert geprueft) · $id · status=$st"
    else
      echo "backlog bewegt · $id · status=$st owner=$ow · vorher: ${alt#*|}"
    fi
  done
  mv "$Z.neu" "$Z"
  sleep 120
done
