---
name: nach-jeder-aufgabe-zurueckmelden
title: Jede abgeschlossene Aufgabe wird beim Verteiler gemeldet
origin: operator
rank: 30
version: 1.0.0
short: "Fertig heißt: der Eintrag ist wahr UND der Verteiler weiß es. Beides, nicht eines von beiden. Eine Sitzung, von der nichts kommt, ist von einer abgestürzten nicht zu unterscheiden — und eine fertige Arbeit, die niemand kennt, blockiert alles, was auf sie wartet."
---
## Warum

der Betreiber, 05.09.2026: *„Im Regelwerk ist auch wichtig, dass nach Abschluss
jeder Aufgabe sich die Agenten bei dir (1 Hub) zurückmelden."*

Es gibt nur **zwei Zustände**: fertig → melden, oder blockiert →
**anhalten und sofort melden**. Einen dritten — still weiterarbeiten,
still warten, still fertig sein — gibt es nicht.

## Was es kostet, wenn die Meldung fehlt

Am 04.09.2026 standen **vier fertige Einträge** einer Sitzung als offen
da. Sie waren gebaut, geprüft und gepusht; jeder Stand war dem Verteiler
in einer Nachricht gemeldet worden — und in keinem Eintrag. Ihre eigene
Formulierung: *„Ich war nicht still, ich habe an der falschen Stelle
geredet."*

Am selben Tag lagen **64 Commits** einer anderen Sitzung auf einem Zweig,
von dem alle glaubten, er sei auf `main` — zwölf Stunden lang wurde
„gepusht" und „auf main" als ein Zustand gemeldet.

Beides kostet dasselbe: Was auf die Arbeit wartet, wartet weiter, obwohl
sie fertig ist.

## Die Meldung enthält

- **Den Stand**: Commit-SHA, Testzahl, Exit-Code — nicht „grün"
- **Was gefunden wurde**, besonders was ein anderer wissen muss
- **Was offen blieb** und woran es hängt
- **„Stapel leer — was brauchst du?"**, wenn nichts mehr da ist

## Beides, nicht eines von beiden

Der Eintrag und die Meldung ersetzen einander **nicht**. Der Eintrag ist
der Stand, den jeder nachlesen kann; die Meldung ist das, was den
Verteiler dazu bringt, den nächsten Strang loszuschicken. Wer nur den
Eintrag schreibt, wird gefunden — irgendwann. Wer nur meldet, hinterlässt
nichts, das die Meldung überlebt.

## Der Prüfstein

Nach der Meldung muss der Verteiler ohne Rückfrage sagen können: was
läuft jetzt, was ist frei, was wartet auf wen. Kann er das nicht, war es
keine Meldung, sondern eine Mitteilung.
