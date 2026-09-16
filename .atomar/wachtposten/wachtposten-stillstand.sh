#!/bin/zsh
# atomar-posten: verfahren
# Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
# Wachtposten B — der DURCHGANG aus Regel langlaeufer-brauchen-einen-takt:
# offene Eintraege, an denen seit Stunden keine Zeile steht. Misst den
# EINTRAG, nicht das Schweigen einer Sitzung. Meldet nur, was neu ueber die
# Schwelle rutscht.
# ER LIEST `origin/main`, NICHT DEN ARBEITSBAUM.
# Gemessen am 06.09.2026: Der gemeinsame Arbeitsbaum lag 197 Commits
# zurueck und meldete T-103 als `open`, waehrend auf `main` `umgesetzt`
# stand — eine Sitzung hatte den Status in IHREM Baum gesetzt und
# gepusht. Ein Durchgang, der den Baum liest, meldet also Stillstand
# ueber Arbeit, die laengst weiterging.
#
# Dieselbe Blindstelle wie bei Posten E, nur mit einer teureren Folge:
# Dort ging es um ungesicherte Zeilen, hier um falsche Meldungen — und
# eine falsche Meldung alle vier Stunden ist der schnellste Weg, einen
# Posten nutzlos zu machen.
# Die Wurzel wird HERGELEITET, nicht getippt: dieser Posten liegt in
# <wurzel>/.atomar/wachtposten/. Ein fest verdrahteter Pfad macht ihn
# fuer jedes andere Projekt unbrauchbar (T-131).
W=${ATOMAR_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}
Z="$(dirname $0)/.stand-stillstand"
SCHWELLE=4   # Stunden
touch "$Z"
# ANLAUF VOR DEM EINTRITT IN DIE SCHLEIFE (T-131). Eine Schleife kehrt nie
# zurueck -- die Bedingung "Exit ungleich 0, wenn eine Voraussetzung fehlt"
# laesst sich also nur HIER pruefen, vor dem `while`. Ohne das lief ein
# Posten in einem Projekt ohne `origin` ewig ueber ein leeres Verzeichnis
# und meldete nie etwas: von aussen nicht von einem stillen Bestand zu
# unterscheiden.
. "$(dirname "$0")/_anlauf.sh"
anlauf_braucht_origin

# DIE ESKALATIONSSTUFEN (T-472, D-111 Baustein 4): was auf einen MENSCHEN
# wartet, misst pruefe-eskalation.mjs in ZWEI Stufen aus einstellungen.md
# (erinnerung_nach / eskalation_nach) — nicht mehr die eine Joachim-Zeile
# unten mit ihrer einen Schwelle. Gemeldet wird der WECHSEL der Stufe, nicht
# der erste Uebertritt: ein Eintrag, der von ERINNERUNG auf ESKALATION
# rutscht, wird ein zweites Mal genannt. Der Merker haelt `id stufe`.
# `$0` ist in einer zsh-FUNKTION der Funktionsname — der Pfad muss hier
# oben stehen, nicht in der Funktion. Gefunden beim ersten Probelauf: der
# Posten wurde unter „eskalationsdurchgang/pruefe-eskalation.mjs" gesucht,
# nicht gefunden, und 2>/dev/null machte daraus Stille.
HIER="$(dirname $0)"
ZE="$HIER/.stand-eskalation"
touch "$ZE"
# Der Posten liest einen ARCHIV-Baum (nur .atomar); das Werkzeug liegt im
# Arbeitsbaum. Ohne diesen Verweis liefe er auf „konnte nicht laufen" — still,
# weil 2>/dev/null. Deshalb hier ausdruecklich.
[ -d "$W/tools/atomar-backlog/lib" ] && export ATOMAR_WERKZEUG="${ATOMAR_WERKZEUG:-$W/tools/atomar-backlog/lib}"
eskalationsdurchgang() {
  local baum=$1 zeile id wort alt
  ATOMAR_ROOT="$baum" node "$HIER/pruefe-eskalation.mjs" | grep -E '^(ERINNERUNG|ESKALATION|OHNE UHR) · ' | while IFS= read -r zeile; do
    wort=${zeile%% ·*}
    id=$(echo "$zeile" | sed -E 's/^[A-Z ]+ · ([A-Z]-[0-9]+) .*/\1/')
    alt=$(grep -m1 "^$id " "$ZE" | cut -d' ' -f2-)
    if [ "$alt" != "$wort" ]; then
      echo "$zeile"
      grep -v "^$id " "$ZE" > "$ZE.neu"; echo "$id $wort" >> "$ZE.neu"; mv "$ZE.neu" "$ZE"
    fi
  done
}

while true; do
  jetzt=$(date -u +%s)
  git -C $W fetch origin -q 2>/dev/null
  B=$(mktemp -d) || exit 2
  git -C $W archive origin/main .atomar/backlog .atomar/einstellungen.md 2>/dev/null | tar -x -C "$B" 2>/dev/null
  # Der Posten liest den frischen Stand von origin/main — denselben Baum wie
  # die Schleife darunter, nicht den Arbeitsbaum (siehe Kopf dieser Datei).
  [ -d "$B/.atomar/backlog" ] && eskalationsdurchgang "$B"
  B="$B/.atomar/backlog"
  for f in $B/*.md; do
    id=${f:t:r}
    st=$(grep -m1 '^status:' $f | sed 's/status: *//')
    # `parked` GEHOERT DAZU, nachgetragen am 08.09.2026: Parken ist die
    # ANTWORT auf „hier passiert nichts", nicht ihr Symptom. Die CLI
    # verlangt dafuer einen Grund, ein geparkter Eintrag traegt ihn also
    # immer. Ihn trotzdem alle vier Stunden zu melden macht genau das,
    # wovor der Kommentar weiter unten warnt: die Meldung wird zur
    # Gewohnheit, und der echte Stillstand faellt daneben nicht mehr auf.
    case "$st" in done|closed|parked) continue;; esac
    letzte=$(grep -o '^- [0-9T:-]*Z' $f | tail -1 | sed 's/^- //')
    [ -z "$letzte" ] && continue
    ts=$(date -u -j -f "%Y-%m-%dT%H:%M:%SZ" "$letzte" +%s 2>/dev/null) || continue
    std=$(( (jetzt - ts) / 3600 ))
    # EIN EINTRAG MIT GENANNTEM GRUND BRAUCHT KEINE VIER-STUNDEN-ERINNERUNG.
    # `waiting` und `umgesetzt` sagen bereits, WORAUF gewartet wird — sie alle
    # vier Stunden zu melden macht die Meldung zur Gewohnheit, und dann faellt
    # der echte Stillstand daneben nicht mehr auf. Zwoelf Stunden sind lang
    # genug, dass „das wartet seit gestern" wieder etwas heisst.
    eigene=$SCHWELLE
    case "$st" in waiting|umgesetzt) eigene=12;; esac
    # UND `active` IST DIE BEHAUPTUNG, GERADE DARAN ZU ARBEITEN.
    #
    # Joachim, 06.09.2026: „Es scheint mir, dass generell oft angekuendigt und
    # nicht gestartet wird. Ohne Input ist dieses ‚ok' eigentlich voellig
    # nutzlos." Zweimal an einem Abend hat eine Sitzung angekuendigt und nicht
    # angefangen -- und die Stille war von Arbeit nicht zu unterscheiden.
    #
    # `open` und still heisst „niemand hat angefangen", und das ist in Ordnung.
    # `active` und still heisst „jemand hat gesagt, er arbeitet daran" -- das
    # ist eine ANGABE, und sie veraltet schneller. Eine Stunde ist lang genug
    # fuer einen Suitelauf und kurz genug, dass eine Ankuendigung ohne Arbeit
    # noch am selben Abend auffaellt.
    case "$st" in active) eigene=1;; esac
    # UND EIN EINTRAG, DER AUF EIN EREIGNIS WARTET, STEHT NICHT STILL.
    #
    # T-181 stand am 08.09.2026 auf `umgesetzt` mit `wartet_auf: deploy` und
    # wurde nach genau zwoelf Stunden gemeldet. Die Antwort auf „hier passiert
    # nichts" stand da bereits IM EINTRAG -- der Posten hat sie nur nicht
    # gelesen. Das ist derselbe Fall wie `parked`: die Meldung wiederholt eine
    # Frage, die schon beantwortet ist, und wird dadurch zur Gewohnheit.
    #
    # Nicht ueberspringen, sondern SPAETER fragen: ein vergessener Deploy soll
    # nach zwei Tagen sehr wohl auffallen. `wartet_auf: joachim` bleibt aussen
    # vor -- das ist die Meldung weiter unten, und die soll frueh kommen.
    #
    # UND NUR `deploy`, NICHT JEDES `wartet_auf`. Gemessen am 08.09.2026:
    # 38 Eintraege warten auf einen Deploy, 4 auf eine `entscheidung`, 2 auf
    # einen `handgriff`. Die letzten beiden warten auf einen MENSCHEN -- die
    # spaeter zu melden hiesse, genau das Liegenbleiben zu verstecken, das der
    # Posten finden soll. Ein Deploy dagegen kommt von selbst.
    wa=$(grep -m1 '^wartet_auf:' $f | sed 's/wartet_auf: *//')
    case "$wa" in deploy) eigene=48;; esac
    if [ $std -ge $eigene ] && ! grep -q "^$id " "$Z"; then
      ow=$(grep -m1 '^owner:' $f | sed 's/owner: *//')
      # EIN EINTRAG BEI JOACHIM STEHT NICHT STILL, ER WARTET.
      # Beide brauchen eine Meldung, aber verschiedene: Bei einer Sitzung
      # ist die Frage „warum arbeitet niemand daran", bei Joachim „weiss
      # er, dass es liegt". Dasselbe Wort fuer beides macht die eine
      # Meldung zur Gewohnheit und die andere unsichtbar.
      # Seit T-472 misst pruefe-eskalation.mjs (oben) alles, was auf einen
      # Menschen wartet, in Stufen — die eine Joachim-Zeile hier entfaellt.
      if [ "$ow" = "Joachim" ]; then
        :
      else
        # EINE ANKUENDIGUNG IST KEIN STAND: `active` und still heisst, dass
        # jemand gesagt hat, er arbeite daran. Das ist eine andere Frage als
        # „niemand hat angefangen" und bekommt deshalb ein anderes Wort.
        if [ "$st" = "active" ]; then
          echo "ANGEKUENDIGT, NICHTS PASSIERT · $id · seit ${std}h keine Zeile · owner=${ow:-niemand} · $(grep -m1 '^title:' $f | sed 's/title: *//')"
        else
          echo "STILLSTAND · $id · seit ${std}h keine Zeile · status=$st · owner=${ow:-niemand} · $(grep -m1 '^title:' $f | sed 's/title: *//')"
        fi
      fi
      echo "$id $std" >> "$Z"
    fi
  done
  rm -rf "$(dirname $B)"
  sleep 900
done
