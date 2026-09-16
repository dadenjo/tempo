---
name: etwas-das-erfolg-meldet-und-nichts-tut
title: Der stumme Fehlschlag — etwas, das aussieht, als funktioniere es
origin: operator
rank: 85
version: 1.0.0
short: "Die haeufigste Fehlerart in diesem System ist nicht der Absturz, sondern der Erfolg ohne Wirkung: ein Deploy, der blockiert und in der Liste steht wie jeder andere; ein Exit-Code 0 ueber roten Tests; ein Knopf ohne Ziel. Gefunden wird er durch Nachzaehlen, nie durch Hinsehen."
---
## Die Zaehlung

Fuenf Faelle in einer Nacht, 05.09.2026, aus vier verschiedenen Sitzungen und
vier verschiedenen Werkzeugen:

| was gemeldet wurde | was war |
|---|---|
| ein Deploy in der Liste, mit eigener Adresse | `BLOCKED` — nie gebaut, `hub.atomar.dev` zeigte weiter auf den alten Stand |
| `[exited with code 0]` | sechs rote Tests darueber |
| ein Knopf „npm veroeffentlichen" | loest `release.yml` aus, den Workflow gibt es seit dem 08.06. nicht |
| eine Freigabe-Zeile im Eintrag | das Werkzeug wies jeden Schreibvorgang darauf ab |
| eine Schleife, fuenfmal „zusammengefuehrt" | ein `git add` scheiterte, niemand las den Rueckgabewert, null Wirkung |

Keiner davon war ein Absturz. Jeder sah aus wie ein Erfolg, und drei davon
liefen seit **Monaten** so.

## Warum diese Art die teuerste ist

Ein Absturz meldet sich selbst. Ein stummer Fehlschlag wird **bestaetigt**: Wer
nachsieht, findet eine Zeile, die Erfolg sagt, und hoert auf zu suchen. Deshalb
faellt er erst auf, wenn jemand darauf **baut** — und dann unter Zeitdruck.

Und er ist besonders gefaehrlich, weil er die Pruefung mitnimmt: Eine gruene
Zeile ueber einem stummen Fehlschlag macht die naechste Freigabe falsch, ohne
dass irgendwo etwas rot wird.

## Woran man ihn erkennt

Immer daran, dass **zwei Dinge auseinanderfallen, die dasselbe sagen sollten**:

- die Liste und die Domain
- der Exit-Code und die Zeile darueber
- der Knopf und das, was er ausloest
- die Regel und das Werkzeug
- die Erfolgsmeldung und das Ergebnis

Ein Wert allein ist nie der Beleg. **Der Beleg ist immer ein Vergleich.**

## Die Regel

- **Nach jeder Handlung, die etwas bewirken soll, wird die WIRKUNG gemessen,
  nicht die Meldung.** Nach einem Deploy die Domain, nicht die Liste. Nach
  einem Zusammenfuehren die Zeilenzahl, nicht das „fertig". Nach einem Lauf die
  Zeile, nicht den Exit-Code.
- **Ein Rueckgabewert, den niemand liest, ist ein Fehlschlag, den niemand
  sieht.** Das gilt fuer Schleifen besonders: Sie wiederholen den Fehler und
  melden ihn n-mal als Erfolg.
- **Wo eine Sache zwei Vertreter hat — Liste und Wirklichkeit, Regel und
  Werkzeug —, gilt die Wirklichkeit, und der Unterschied gehoert in den
  Eintrag.**

## Was daraus fuer Werkzeuge folgt

Wer eines baut, sorgt dafuer, dass ein Fehlschlag **laut** ist. Ein Skript, das
bei einer Absage `0` zurueckgibt, ist keine Bequemlichkeit, sondern eine Falle
mit Vorlaufzeit — bei uns hat sie zweimal an einem Abend fast eine falsche
Freigabe getragen.

## Die haeufigste Ursache: ein LAUFENDER Zustand ist aelter als der Code

Drei Faelle an einem Abend, alle drei zuerst als Codefehler gemeldet:

| was gemeldet wurde | was war |
|---|---|
| „das Regelwerk ist nicht versioniert" (T-071) | der `.gitignore`-Schutz war gebaut — der **Hauptcheckout** lag 51 Commits zurueck |
| „das Werkzeug weist Freigaben ab" (T-080) | das Schema kannte das Feld — die **Kommandozeile im Hauptcheckout** war alt |
| „`/regeln` gibt 404" (T-073) | der Endpunkt existiert — der **laufende Dienst** ist 29 Stunden alt |

Dazu ein vierter, aus derselben Nacht: ein Deploy, der lief und **den alten
Stand** trug.

**Der Code ist neu, und die Sache, die ihn ausfuehrt, ist alt.** Beide Zustaende
sind fuer sich stimmig — und die Fehlermeldung zeigt immer auf den Code, weil
der der einzige ist, den man lesen kann.

### Woran man es erkennt

Wenn eine Messung sagt „das gibt es nicht" und eine andere „das gibt es",
**bevor man den Code verdaechtigt: fragen, was gerade LAEUFT und seit wann.**

- Ein Prozess: seit wann, auf welchem Stand?
- Ein Checkout: `git rev-list --count HEAD..origin/main`
- Ein Werkzeug: aus welchem Verzeichnis aufgerufen?
- Ein Deploy: gegen die **Domain** gemessen, nicht gegen die Liste?

### Und die teuerste Folge

**Der Schutz ist gebaut und wirkt nicht** — an genau der Stelle, an der er
zaehlt. Wer das nicht dazuschreibt, meldet „behoben" und meint „behoben, sobald
jemand etwas neu startet". Zwischen beidem liegt manchmal ein Tag.

## Verwandt

[[die-gegenprobe]] · [[waechter-die-nichts-bewachen]] · [[messen-statt-vermuten]]

## Ein Ordner, der versioniert AUSSIEHT

06.09.2026. Die Wachtposten liegen in `.atomar/wachtposten/` — neben
`.atomar/backlog/` und `.atomar/rules/`, die beide versioniert sind. Beim
Einchecken eines neuen Postens:

```
The following paths are ignored by one of your .gitignore files:
.atomar/wachtposten
```

**Kein einziger Posten war je versioniert.** `.gitignore` ignoriert
`/.atomar/*` und laesst nur einzeln zurueckgeholte Pfade durch; `backlog` und
`rules` stehen dort, `wachtposten` stand nicht.

Der Fehler ist die **Nachbarschaft**: Drei Ordner nebeneinander, zwei davon
versioniert, und der dritte sieht genauso aus. In Notizen stand ausdruecklich
„versioniert, ueberlebt einen Compact" — eine Behauptung, die niemand geprueft
hatte, weil sie plausibel war.

**Ein Posten, der den naechsten frischen Baum nicht ueberlebt, ist keiner.** Er
laeuft, meldet, sieht vollstaendig aus — und ist beim naechsten `worktree add`
weg, ohne dass irgendwo etwas fehlt.

### Der Handgriff

`git check-ignore -v <pfad>` beantwortet die Frage in einer Sekunde und nennt
die Zeile, die es tut. Er gehoert an dieselbe Stelle wie die Gegenprobe: **beim
ANLEGEN von etwas, das ueberdauern soll**, nicht beim ersten Vermissen.

Und die Ausnahme, die dabei bleibt: **laufende Staende** (`.stand-*`) bleiben
ignoriert. Ein gespeicherter Messstand in einem fremden Baum ist eine Aussage
ueber eine Messung, die dort nie stattgefunden hat.

## Der laufende Posten ist nicht die versionierte Datei

06.09.2026. Wachtposten B wurde verbessert — er soll `WARTET AUF JOACHIM` von
`STILLSTAND` unterscheiden. Die Aenderung ging in
`.atomar/wachtposten/wachtposten-stillstand.sh`, wurde gepusht, und **der
laufende Posten meldete weiter das alte Wort.**

Der Grund war nicht, dass er den Code zwischenspeichert. Er lief aus einer
**anderen Datei**:

```
laufend:      …/scratchpad/wachtposten-stillstand.sh
versioniert:  .atomar/wachtposten/wachtposten-stillstand.sh
diff:         WEICHT AB
```

Ein zweiter Posten war identisch, ein dritter (`wachtposten-compact.sh`) hatte
**gar kein versioniertes Gegenstueck.**

### Warum das schlimmer ist als ein alter Stand

Ein Posten, der eine aeltere Fassung faehrt, wird beim Neustart richtig. Ein
Posten, der eine **andere Datei** faehrt, wird es nie — man kann die
versionierte Fassung beliebig verbessern, und nichts aendert sich. Und beim
Lesen sieht man den Unterschied nicht: Beide Dateien heissen gleich.

### Der Handgriff

- **Posten immer aus dem versionierten Pfad starten**, nie aus einer Kopie.
- **Nach jeder Aenderung an einem Posten: neu starten.** Ein bearbeiteter Posten
  ist bis dahin ein Vorsatz.
- Und einmal je Sitzung die Gegenprobe, die diesen Fall gefunden hat:
  ```
  ps -eo command | grep wachtposten     # was laeuft wirklich
  diff <laufende Datei> .atomar/wachtposten/<gleicher Name>
  ```
  Bleibt es still, stimmen Bestand und Betrieb ueberein. Sonst nicht.

Dieselbe Familie wie ein Ordner, der versioniert aussieht: **Die Frage ist nie,
was dasteht, sondern was laeuft.**

## Ein Backtick in einem ungequoteten Heredoc frisst ein Wort

2 Agent, 06.09.2026. Sie schrieb einen Eintrag mit einem **ungequoteten**
Heredoc, damit der Zeitstempel eingesetzt wird. Die Shell hat ein Backtick-Paar
als **Befehl** ausgefuehrt und sein Ergebnis eingesetzt — also nichts:

```
geschrieben:  „T-075 hat `pp_rides` beigebracht, …"
in der Datei: „T-075 hat  beigebracht, …"
```

**Der Satz las sich weiter fluessig und war falsch.** Kein Syntaxfehler, keine
kaputte Datei, nur ein fehlendes Wort und zwei Leerzeichen.

Aufgefallen ist es an `command not found: pp_rides`, das **neben** der
Erfolgsmeldung stand: **Der Push lief durch, die Datei war beschaedigt.** Genau
die Form, gegen die diese Regel geschrieben ist — nur eine Ebene tiefer, im
Werkzeug, mit dem wir ueber Werkzeuge schreiben.

### Der Handgriff

- **Markdown mit Code-Auszeichnung immer in ein GEQUOTETES Heredoc** (`<<'EOF'`).
  Zeitstempel und andere Werte danach ersetzen, nicht durch die Shell einsetzen
  lassen.
- Und die Suche, die sie gefunden hat, taugt als Gegenprobe fuer den ganzen
  Bestand:
  ```
  grep -nE '[a-zäöüA-Z]  +[a-zäöüA-Z]'
  ```
  Zwei Leerzeichen zwischen zwei Woertern sind entweder Ausrichtung in einem
  Codeblock — oder ein verschlucktes Wort. Am 06.09. ueber alle Eintraege und
  Regeln gefahren: neun Treffer, **alle Ausrichtung**, kein zweiter Fall.

### Und diese Suche hat selbst einen blinden Fleck

2 Agent, im selben Zug — sie hat die Grenze ihrer eigenen Gegenprobe benannt,
bevor jemand sie fuer erschoepfend hielt:

> `[a-z]  +[a-z]` findet einen verschluckten Ausdruck **nur, wenn links und
> rechts ein Wort steht.** Verschwindet er am **Zeilenanfang**, **vor einem
> Komma**, oder als einziger Inhalt einer **Klammer**, bleibt kein doppeltes
> Leerzeichen zurueck — und die Suche schweigt.

Sie hat deshalb ein zweites Muster gefahren: leere Backtick-Paare, leere
Klammern, Leerzeichen vor Satzzeichen, Zeilen die mit einem Satzzeichen
beginnen. Auch nichts.

**Und die Fassung, in der das Ergebnis vertretbar ist, ist ihre:**

> Nicht „es gibt keinen zweiten Fall", sondern **„zwei verschiedene Suchen ueber
> die betroffenen Dateien finden keinen"**.

Der Verteiler hatte die staerkere Fassung gemeldet. Eine Suche ist ein
Werkzeug mit einem Zuschnitt; ihr Schweigen deckt genau den Zuschnitt und keinen
Millimeter mehr.

### Die Abhilfe ist die Bauart, nicht die Suche

> **Ein Zeitstempel rechtfertigt kein ungequotetes Heredoc.** Gequotet schreiben
> und den Stempel danach ersetzen kostet eine Zeile und macht den ganzen
> Fehlerweg unmoeglich.

Die Suche ist die Gegenprobe fuer den **Bestand**. Sie ist kein Schutz fuer das
**Naechste**.

## Ein Posten, der geschrieben und gepusht wurde und nie lief

1 HUB, 06.09.2026. der Betreiber musste zum dritten Mal an einem Tag sagen, dass
Fertiges sofort auf `main` gehoert. Die Ursache war meine Antwortzeit als
Verteiler, also habe ich einen Wachtposten gebaut, der offene PRs meldet,
sobald es sie gibt.

Geschrieben, `zsh -n` gruen, committet, gepusht, im Bericht angekuendigt.

**Gestartet habe ich ihn nicht.**

```
pgrep -fl wachtposten-prs.sh
-> nichts
```

Zwischen „es gibt ihn" und „er laeuft" liegt ein Schritt, den kein Commit
und kein gruener Syntaxcheck belegt. Die Datei auf `main` beweist, dass sie
existiert — nicht, dass irgendwo ein Prozess sie ausfuehrt.

### Warum es sich nicht wie ein Versaeumnis anfuehlt

Es gab ja eine Handlung: schreiben, pruefen, pushen, melden. **Vier Schritte,
alle richtig, und der fuenfte fehlt.** Dieselbe Bewegung wie eine Zahl, die
man fortschreibt statt zu zaehlen, und wie ein Bericht, der in Nachrichten
statt in den Bestand geht: *Es fuehlte sich wie Arbeit an.*

Und es ist besonders bitter bei einem Posten: **Ein Waechter, der nicht
laeuft, ist von einem Waechter ohne Befund nicht zu unterscheiden.** Beide
schweigen. Das Schweigen haette ich als „keine offenen PRs" gelesen.

### Die Regel

- **Wer einen Dauerlaeufer baut, startet ihn in derselben Runde** — und
  belegt es mit `pgrep`, nicht mit dem Commit.
- **Ein schweigender Posten ist erst dann ein Befund, wenn bewiesen ist,
  dass er laeuft.** Vorher ist sein Schweigen eine Nicht-Messung.
- Und derselbe Fehler traf am selben Tag bereits zweimal die andere
  Richtung: ein Baum, der noch die alte Fassung des Postens ausfuehrte,
  waehrend die verbesserte auf `main` lag.
