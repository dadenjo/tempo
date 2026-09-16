---
name: ein-eintrag-der-ueber-sich-selbst-luegt
title: Was offen dasteht, ist für alle offen — auch wenn die Arbeit längst liegt
origin: operator
rank: 37
version: 1.0.0
short: "Am 06.09. standen sieben Einträge auf „offen\", deren Arbeit auf main lag. Einer davon wurde deshalb ein zweites Mal vergeben, drei ließen Wächter Stillstand melden, wo keiner war. Ein Status, der nicht nachgezogen wird, kostet mehr als eine fehlende Notiz."
---
## Der Tag

| Eintrag | stand auf | war |
|---|---|---|
| T-075 | open | seit 04:28 auf `main` — **ich habe die Aufgabe ein zweites Mal vergeben** |
| T-073 | open | fertig, meine eigene letzte Logzeile sagte es bereits |
| T-081 | open | gebaut, wartete nur auf einen Deploy |
| T-109 | active | gebaut, wartete auf den Hub-Deploy — Wächter meldete „Stillstand" |
| T-110 – T-112 | open | gemergt, auf 3100 sichtbar |
| T-117, T-118 | open | gemergt |
| T-065 | waiting | **das Sicherheitsloch war seit Stunden zu** |

## Der teuerste Fall

2 Agents Formulierung, nachdem ich ihr T-075 zum zweiten Mal gegeben hatte:

> **„Was nicht im Backlog steht, gibt es nicht" gilt auch andersherum: Was
> dort offen steht, ist für alle offen.**

Sie hatte gemeldet, gepusht, den PR aufgemacht — und nur den Status nicht
nachgezogen. Ich habe die Liste gelesen statt den Bestand, und daraufhin
Arbeit vergeben, die es schon gab.

## Was ein falscher Status sonst noch kostet

- **Wächter melden Stillstand, wo keiner ist.** Dreimal an einem Abend. Wer
  das ein paarmal erlebt, liest die Meldungen bald nicht mehr — und dann
  fehlt der Posten genau dann, wenn er recht hat.
- **Ein Sicherheitsbefund gilt als offen, obwohl er zu ist** (T-065). Beim
  nächsten Durchgang landet er wieder auf einer Dringlichkeitsliste.
- **Und umgekehrt:** T-110 sah nach „erledigt" aus, weil ein PR mit passendem
  Titel gemergt war — der hatte aber nur die halbe Sache gebaut. **Ein
  gemergter PR ist kein Beleg für einen erledigten Eintrag.**

## Die Regel

- **Wer meldet, zieht den Status im selben Zug nach.** Die Meldung an den
  Verteiler ersetzt ihn nicht — sie überlebt keinen Compact und niemand
  sonst liest sie.
- **`umgesetzt` mit `--wartet-auf` ist der richtige Zustand für „gebaut, auf
  main, noch nicht draußen".** Er unterscheidet fertige Arbeit von liegender.
- **Der Verteiler geht regelmäßig über die offenen Einträge** und prüft, was
  davon in Wahrheit auf `main` liegt — `pruefe-erledigt.mjs` findet die
  Kandidaten, die Entscheidung bleibt von Hand.
- **Und die Prüfung geht am GEGENSTAND, nicht am PR-Titel.**

Verwandt: [[langlaeufer-brauchen-einen-takt]],
[[beide-richtungen-landen-im-eintrag]].

## Das Spiegelbild: eine Ankündigung ist kein Stand

3 Agent, 06.09.2026, auf die Frage nach vier Stunden Stille:

> **„Ich habe T-119 in meiner letzten Meldung angekündigt — ‚fange ich als
> Nächstes an' — und dann nicht angefangen. Der Wachtposten misst also
> richtig, und der Eintrag lügt nicht über sich selbst: Er steht auf `open`,
> und offen ist er."**

**Die sieben Fälle oben sind der eine Fehler: fertige Arbeit, die als offen
dasteht. Das hier ist der andere: angekündigte Arbeit, die als angefangen
gilt** — weil sie in einer Nachricht steht.

**Beide Male hat der Eintrag recht und die Nachricht unrecht.**

### Woran der Verteiler es unterscheidet

Gar nicht — und das ist der Punkt. Ein Eintrag ohne Zeile seit Stunden kann
beides heißen. **Deshalb fragt man, statt zu schließen oder zu mahnen.**

Am selben Abend hat dieselbe Nachfrage etwas gerettet, das keine Statuszeile
gezeigt hätte: Der Zuschnitt der Aufgabe hatte sich zweimal geändert, und ohne
die Frage wäre gegen einen Stand gebaut worden, den es nicht mehr gab —
*„D-047 hätte ich nicht gekannt und vermutlich `{{name}}` gebaut."*

**Vier Stunden Stille sind kein Befund. Vier Stunden Stille gegen einen
veralteten Zuschnitt wären einer geworden.**
