---
name: freigaben-stehen-im-backlog
title: Eine Freigabe, die im Chat erbeten wird, gibt es nicht
origin: operator
rank: 20
version: 1.0.0
short: "Eine Freigabe ist kein Backlog-Eintrag, sondern die wichtigste Zeile im Backlog: Sie hält alles andere an. Sie steht als eigener Eintrag, getrennt vom Inhaltlichen — mit dem, was hinausginge, dem geprüften Stand und dem Preis des Wartens. Wer sie nur im Gespräch erbittet, hat nicht gefragt."
---
## Warum

Am 04.09.2026 stand auf der Seite unter „wartet auf der Betreiber" das Wort
**nichts** — während im Chat seit einer halben Stunde eine Freigabe für
Push, Deploy und Testversand offen war. Wer die Übersicht öffnet, um zu
sehen, was an ihm hängt, sieht dann das Gegenteil der Wahrheit.

## Was hineingehört

Eine Freigabe ist ein eigener Eintrag, kein Nebensatz in einer Aufgabe.
Er trägt:

- **Was genau hinausgeht** — welcher Stand, welche fremde Arbeit fährt mit
- **Der geprüfte Beleg** — die SHA und die Zeile, die sie freigibt
- **Was danach passiert** und was noch einmal zurückkommt
- **Wo die Freigabe zu erteilen ist** — im Eintrag, oder an einer Stelle,
  die nur ein Mensch bedienen kann

## Deployment-Freigaben sind eine eigene Art

Sie sind nach außen gerichtet und schwer zurückzuholen. Wo eine Handlung
**persönlich** erfolgen muss — ein Knopf hinter der Anmeldung, ein Versand
an einen echten Empfänger —, steht das **im Eintrag**, mit dem Weg dorthin.
„Sag Bescheid, dann macht es jemand" ist keine Anleitung, wenn niemand
außer dem Menschen es tun kann.

## Der Prüfstein

Wer nur die Backlog-Seite ansieht und nie den Chat liest, muss trotzdem
wissen, dass etwas an ihm hängt — und was es kostet, es liegen zu lassen.

## Eine Freigabe ist etwas anderes als eine Entscheidung

der Betreiber, 05.09.2026: *„Das ist eigentlich das wichtigste Backlog-Item,
also eher eine Freigabe als ein Backlog-Item — möglicherweise sollten wir
zwischen Inhaltlichem und Freigaben unterscheiden."*

Die beiden sehen im Werkzeug gleich aus und verhalten sich gegensätzlich:

| | inhaltliche Entscheidung | Freigabe |
|---|---|---|
| Was fehlt | ein Urteil | ein Wort |
| Vorbereitung | wird erst durch die Antwort möglich | ist vollständig, alles wartet |
| Liegenlassen | kostet nichts, reift manchmal sogar | hält jeden anderen Strang an |
| Haltbarkeit | gilt weiter | **verfällt, sobald sich der Stand bewegt** |

Der letzte Punkt ist der teuerste. Eine Freigabe gilt **für einen Stand,
nicht für eine Sache** — und der Stand bewegt sich, während sie wartet.

## Belegt, dreimal an einem Tag

- „ja setzen" galt für **zwei** Zeilen; als daraus vier und 24 wurden,
  wurde dieselbe Zustimmung weitergereicht. Sitzung 3 hat es gemerkt.
- „ok, ausrollen" galt einem **Rechtstext**; ausgerollt worden wären
  **40 fremde Commits**, darunter die Trial-Zählung. Sitzung 6 hat es
  gemerkt.
- „ok deploy" galt für `65d261041`; zwei Stunden später stand `main` auf
  einem anderen Stand, und die Freigabe deckte ihn nicht mehr.

Dreimal hat es jemand anderes gefangen, nie der Verteiler. Deshalb steht
diese Regel jetzt weit oben und nicht in der Mitte.

## Der Preis des Wartens gehört in den Eintrag

Nicht nur *was* freigegeben werden soll, sondern **was steht, solange es
nicht freigegeben ist**. Eine Freigabe ohne diesen Satz sieht aus wie
eine Frage, die Zeit hat.
