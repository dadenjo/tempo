---
name: dauer-schaetzen-bei-uebernahme
title: Wer einen Eintrag übernimmt, meldet zuerst die erwartete Dauer zurück
origin: operator
rank: 260
version: 1.0.0
short: "Vor dem ersten Handgriff: den Eintrag lesen, kurz analysieren und die erwartete Dauer melden. Erst danach wird gebaut. Ohne diese Zahl gibt es später keine Abweichung — und ohne Abweichung lernt niemand schätzen."
---
## Der Ablauf

1. Eintrag übernehmen, lesen, **analysieren**.
2. **Erwartete Dauer zurückmelden** — an den, der beauftragt hat, und in
   das Feld `expected`.
3. Erst dann bauen.

Die Schätzung ist keine Zusage. Sie ist der Anfang einer Messung: Ohne
sie gibt es später keine Abweichung, und ohne Abweichung lernt niemand,
besser zu schätzen.

## Warum die Analyse vor die Zahl gehört

Eine Zahl ohne Analyse ist geraten, und geraten sieht genauso aus wie
geschätzt. Wer vorher liest, findet außerdem regelmäßig, dass der Auftrag
etwas anderes verlangt, als er zu verlangen schien — **das ist der
billigste Zeitpunkt, an dem das auffallen kann**.

## Weicht es ab, wird das gesagt

Nicht am Ende, sondern **sobald es absehbar ist**. Eine Abweichung, die
erst mit dem Ergebnis kommt, kostet den, der geplant hat, genau die Zeit,
die man ihm hätte lassen können.

## Und alles kommt zurück — sonst steht es nirgends

Die Schätzung ist nur der erste Rückmelder. **Jede** Sitzung meldet alles
zurück, was den Eintrag verändert: die erwartete Dauer, jede Abweichung
davon, den Zwischenstand, jeden Befund, jede Entscheidung, die sie
unterwegs treffen musste, und den Abschluss mit Commit, Testzahl und
Exit-Code.

**Warum:** Der Eintrag ist die Wahrheit, und niemand außer dem
Auftraggeber schreibt ihn fort. Was nur in einer Nachricht steht — oder
nur im Kopf der Sitzung, die es getan hat —, ist am nächsten Morgen weg.
Dann steht im Backlog ein Zustand, den es nicht mehr gibt, und jeder, der
danach plant, plant auf einer Lüge.

**Der Prüfstein:** Nach jeder Rückmeldung muss der Eintrag ohne weitere
Nachfrage stimmen. Muss der Auftraggeber nachfragen, um ihn fortschreiben
zu können, war die Meldung unvollständig — auch dann, wenn sie höflich,
kurz und pünktlich war.

Am 04.09.2026 stand T-008 auf `open`, während die Arbeit längst auf `main`
lag. Nichts war schiefgegangen; es hatte nur niemand zurückgemeldet, dass
es fertig war.

## Bauen kann man schätzen, Suchen nicht

Gemessen am 04.09.2026 an zehn abgeschlossenen Aufgaben einer Sitzung:

| | |
|---|---|
| **klein** | 3–6 min — eine Stelle, Regel schon da, Wächter vorhanden |
| **mittel** | 10–20 min — neue Regel oder neue Stelle, ein neuer Wächter |
| **groß** | 30–45 min — **Ursache noch unbekannt** |

Der Ausreißer ist der lehrreiche Teil: 42 Minuten für einen Riegel, der
in fünf gebaut war. Die anderen 37 gingen dafür drauf, überhaupt zu
finden, *woran* es lag.

**Ist die Ursache offen, werden ZWEI Zahlen genannt:** „vier Minuten,
wenn es die vermutete Ursache ist; bis vierzig, wenn ich sie erst finden
muss." Eine Spanne ist ehrlicher als ein Mittelwert, der beides
zusammenrührt und keins von beidem trifft.

**Und der Vorbehalt gehört mitgeliefert:** Abstände zwischen Commits sind
keine reine Arbeitszeit. Sie sind eher zu kurz als zu lang — die Denkzeit
vor dem ersten Commit einer Aufgabe fällt in den Abstand davor.
