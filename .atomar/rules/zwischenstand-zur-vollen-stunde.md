---
name: zwischenstand-zur-vollen-stunde
title: "Zu jedem Thema ein Zwischenstand im Takt"
origin: operator
rank: 270
version: 1.0.0
short: "Solange du an etwas sitzt, gehört zu jedem Thema mindestens einmal je Takt eine Zeile in den Eintrag — der STAND, nicht die Tätigkeit. Kein Fortschritt ist auch ein Zwischenstand; dann steht dort, woran es hängt. Der Takt steht in `.atomar/einstellungen.md`, Vorgabe 1h."
---
## Warum

Ohne Takt meldet jeder dann, wenn ohnehin etwas passiert. Gemeldet
werden muss aber vor allem das Gegenteil — **die Stunde, in der nichts
vorangeht**. Genau die erzeugt von sich aus keine Nachricht, und genau
sie ist die, in der jemand hätte eingreifen können.

Deshalb ist der Takt eine Uhr und kein Anlass. Ein Anlass meldet sich
selbst; eine Uhr fragt auch dann, wenn es nichts zu berichten gibt.

## Was eine Meldung ist

**Der STAND, nicht die Tätigkeit.** „Arbeite weiter daran" ist keine
Meldung — es sagt, dass jemand beschäftigt ist, und das war schon
bekannt.

Brauchbar ist, was jemand anders zum Handeln befähigt:

    was steht      · was gemessen wurde, mit Zahl
    was offen ist  · und woran es hängt
    was als Nächstes kommt

**Kein Fortschritt ist auch ein Zwischenstand.** Dann steht dort,
woran es hängt — und das ist oft die wertvollere der beiden Meldungen,
weil sie die einzige ist, die jemand aufheben kann.

## Der Takt

`.atomar/einstellungen.md`:

    zwischenstand_takt: 1h

Verstanden werden `30min`, `1h`, `2h`, `1d`. Etwas anderes ist ein
**Fehler**, keine stillschweigende Vorgabe: wer `stuendlich` schreibt
und keinen Fehler liest, glaubt, es sei eingestellt, während in
Wahrheit die Vorgabe gilt. Das ist die häufigste Form der Einstellung,
die nichts einstellt.

## Was das Werkzeug dazu tut — und was nicht

Es **zeigt Stille**: ein Eintrag auf `active`, dessen jüngste Log-Zeile
*seines Eigentümers* älter als der Takt ist, wird markiert —
„Zwischenstand überfällig, seit HH:MM". Man soll Stille sehen, nicht
vermuten.

Es **erzwingt nichts**. Die Regel gilt zwischen Menschen und Sitzungen,
nicht durch eine Sperre. Eine Sperre, die man umgehen muss, wird
umgangen; und eine Meldung, die nur entsteht, weil ein Werkzeug sie
verlangt, sagt nichts.

## Die Fallen, beide schon dagewesen

**Es zählt die jüngste Zeile DES EIGENTÜMERS**, nicht die jüngste
überhaupt. Sonst setzt der Kommentar eines anderen die Uhr zurück, und
ein Eintrag sieht betreut aus, an dem seit zwei Stunden niemand
arbeitet. Das ist schlimmer als keine Anzeige.

**Ein Eintrag ohne jede Log-Zeile ist nicht „gerade gemeldet"**,
sondern seit dem START überfällig. Nicht seit dem Erstelldatum: ein
Eintrag kann drei Tage liegen und seit zehn Minuten laufen, und eine
Marke, die bei jedem Start sofort angeht, liest keiner mehr. Ist kein
Start erfasst, sagt die Ansicht **dass er fehlt** — sie rät keinen
Bezugspunkt herbei.
