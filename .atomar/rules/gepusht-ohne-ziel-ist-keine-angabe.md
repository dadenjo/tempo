---
name: gepusht-ohne-ziel-ist-keine-angabe
title: „Gepusht" ohne Ziel ist keine Angabe — nur `main` zaehlt
origin: operator
rank: 32
version: 1.0.0
short: "Eine SHA und das Wort „gepusht\" klingen wie Fertigmeldung und koennen einen Zweig meinen, den niemand sonst sieht. Wer meldet, nennt das ZIEL und belegt es; wer liest, prueft es, statt das Naheliegende zu verstehen."
---
## Der Fall, zweimal an einem Abend

05.09.2026. Zwei Sitzungen meldeten stundenlang „gepusht", mit SHA, und meinten
ihren Zweig.

**6 Agent**, Maileditor: Der Zweig lag **82 Commits vor `main`** und hatte
keinen offenen PR. Ihre eigene Einordnung: *„‚Gepusht' ohne Ziel ist keine
Angabe."*

**2 Agent**, Spielmodus: Von neun gemeldeten SHAs lag **genau eine** auf `main`
— und die nur, weil der Verteiler sie selbst umgepflanzt hatte. T-066, T-083,
T-085 und die Freizone fuer die Werbetafeln lagen auf
`origin/claude/t083-auswertung-nennt-ihre-frage`.

**Und der Verteiler hat es beide Male weitergetragen.** der Betreiber bekam gemeldet,
der Maileditor sei „als Ganzes benutzbar" und das Spiel sei „fertig und auf
`main`". Beides waren Aussagen ueber Zweige, die ausser der bauenden Sitzung
niemand sieht.

Am 04.09. war es schon einmal derselbe Fall: 64 Commits auf einem Zweig, von
dem alle glaubten, er sei auf `main`. Es steht seither als Beleg in
[[nach-jeder-aufgabe-zurueckmelden]] — und hat den dritten Fall nicht
verhindert, weil dort „melden" geregelt ist und nicht **was gemeldet wird**.

## Warum es so leicht passiert

„Gepusht" ist wahr. Die SHA ist echt. Der Testlauf ist gelaufen. **Nichts an
der Meldung ist falsch — sie ist nur unvollstaendig**, und die fehlende Haelfte
ist genau die, die der Leser stillschweigend ergaenzt.

Und sie ist teuer in beide Richtungen:

- **Vorwaerts**: Was auf einem Zweig liegt, ist fuer jeden anderen nicht da.
  Ein zweiter baut dasselbe noch einmal — am 05.09. gab es den Editor-Fix
  **zweimal**, in zwei richtigen Fassungen, von zwei Sitzungen.
- **Rueckwaerts**: Ein Zweig, der 82 vorlaeuft, laeuft auch 82 **zurueck**.
  Jede gruene Zahl darauf ist eine Aussage ueber den eigenen Code, nicht ueber
  den zusammengefuehrten Stand.

## Die Regel

**Wer meldet, nennt das Ziel** — „auf `main`" oder „auf Zweig X, PR fehlt
noch". Ohne Ziel gilt die Meldung als **Zweig**, nicht als `main`.

**Wer meldet, belegt es**, wenn es `main` sein soll:

```bash
git merge-base --is-ancestor <sha> origin/main && echo "auf main"
```

**Wer liest, prueft es.** Das Naheliegende zu verstehen ist keine
Nachlaessigkeit des Lesers, sondern eine Luecke in der Meldung — und der Leser
ist derjenige, der sie an der Betreiber weitergibt.

**Und ein Zweig ohne PR ist kein Zwischenstand, sondern ein Risiko mit
Verfallsdatum.** Wer einen aufmacht, macht auch den PR auf — oder nennt im
Eintrag, wann er es tut.

## Die Falle mit dem richtigen Satz: „0 hinter origin/main"

2 Agent, 05.09.2026, ueber ihre eigenen neun Meldungen:

> *„Ich habe in jeder Meldung ‚0 hinter origin/main' geschrieben. Das ist
> richtig und klingt wie ‚drin'. Es heisst aber nur, dass mein Zweig ALLES von
> main hat — nicht, dass main irgendetwas von mir hat. Die Richtung fehlte, und
> sie ist die ganze Aussage."*

Das ist die gefaehrlichste Form dieser Meldung, weil sie **eine Messung
enthaelt**. Wer eine Zahl sieht, hoert auf zu fragen. Und die Zahl ist
richtig — sie beantwortet nur die andere Frage.

| Befehl | beantwortet |
|---|---|
| `git rev-list --count HEAD..origin/main` | was **mir** von main fehlt |
| `git rev-list --count origin/main..HEAD` | was **main** von mir fehlt |
| `git merge-base --is-ancestor <sha> origin/main` | **liegt es drin** |

Nur der dritte beantwortet „ist es da". Die ersten beiden sind Abstaende, und
ein Abstand von 0 in der einen Richtung sagt nichts ueber die andere.

## Verwandt

[[nach-jeder-aufgabe-zurueckmelden]] · [[etwas-das-erfolg-meldet-und-nichts-tut]] · [[miss-den-baum-bevor-du-die-suite-misst]]

## Und die Umkehrung: „liegt NICHT auf main" ist genauso zu belegen

06.09.2026, der Verteiler. Er fand neun Commits auf einem Zweig ohne Pull
Request, prueft die Abstammung und meldet:

```
git merge-base --is-ancestor bc4324a4c origin/main   →   nein
git merge-base --is-ancestor b474e3055 origin/main   →   nein
```

Daraus wurde: *„der Betreibers eigene Spiel-Befunde liegen seit Stunden fertig da und
niemand hat sie ausgeliefert."* Ein Auftrag ging raus, mit Vorrang.

**Die Arbeit war seit einer Stunde auf `main`.** Eine andere Sitzung hatte sie
aus einem frischen Zweig eingereicht (PR #1675, `0ce2184cb`), eine Stunde vor
der Messung. Der beauftragte Agent hat es gefunden, weil sein `cherry-pick`
`empty` und *add/add mit byte-identischem Inhalt* meldete.

### Warum die Messung falsch war, obwohl sie stimmte

**Die Abstammung einer SHA sagt nichts ueber ihren INHALT.** Ein Squash-Merge
erzeugt einen neuen Commit; der urspruengliche ist danach fuer immer „nicht auf
`main`", auch wenn jede Zeile daraus dort steht. Genau derselbe Satz steht seit
Wochen in der anderen Richtung im Regelwerk — er gilt in beide.

| Frage | Werkzeug |
|---|---|
| Ist DIESER COMMIT auf main? | `merge-base --is-ancestor` |
| Ist DIESE ARBEIT auf main? | `git diff <sha> origin/main -- <pfade>` |

Nur die zweite Frage traegt einen Auftrag. Leerer Diff heisst: es ist da, unter
einem anderen Namen.

### Und der Teil, der wehtut

Der Verteiler hatte **eine Stunde zuvor ein Werkzeug gebaut**, das offene
Eintraege gegen gemergte Pull Requests haelt. Es lief. Es meldete woertlich:

```
SCHON GETAN? · T-083 [open] · PR #1675 gemergt 2026-09-05T22:00 · …
SCHON GETAN? · T-085 [open] · PR #1675 gemergt 2026-09-05T22:00 · …
```

**Er hat die Zeilen gelesen und trotzdem beauftragt.** Ein Werkzeug, das den
Befund liefert, ersetzt den Handgriff nicht, ihn zu GLAUBEN — und am
schwersten zu glauben ist er dann, wenn man gerade eine gute Geschichte hat,
in die er nicht passt.
