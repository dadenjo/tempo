---
name: eine-luecke-im-eintrag-ist-eine-frage-die-der-hub-stellt
title: "Eine Lücke im Eintrag ist eine Frage — und der Hub stellt sie, sofort"
origin: operator
rank: 276
version: 1.0.0
short: "Ein leeres Feld, ein unbelegbarer Status, ein Commit mit Nummer ohne Erledigung: das sind Fragen, keine Befunde. Der Hub belegt, was das Repo hergibt, fragt den Rest sofort bei JEDEM Owner und hinterlässt die Frage als Zeile im Eintrag. „Braucht Wissen des Owners" ist der Anfang, nicht das Ende."
---
## Woher die Regel kommt

11.09.2026, morgens. Der Hub bereinigt die Baseline, zieht 13 veraltete
Status nach — und schreibt dann an den Betreiber:

> Was ich nicht angefasst habe, weil es Wissen der Owner braucht: 10
> waiting-Einträge ohne wartet_auf, fünf Einträge mit Commits, deren
> Erledigung ich nicht belegen kann.

der Betreiber darauf: *„Aber deine Aufgabe ist es ja, diese Informationen,
wenn sie fehlen, einzuholen."*

Er hat recht. Die Liste war korrekt, und sie war eine **Abgabe** an den
Falschen: Wer sie liest, muss selbst herausfinden, wen er fragt. Genau das
ist die Arbeit, für die der Hub da ist.

## Was eine Lücke ist

Nicht nur Stille. [[hub-fasst-nach]] deckt den Eintrag, der auf `active`
steht und dessen Uhr abläuft. Eine Lücke hat **keine Uhr**:

    waiting ohne wartet_auf          — worauf? Niemand kann es lesen.
    open mit eigenem Commit auf main — fertig oder nur berührt?
    done mit wartet_auf gesetzt      — Feld nach seinem Zweck stehen geblieben
    owner leer                       — wem gehört die Frage überhaupt?

Alle vier sind ohne Dauer messbar. Keine von ihnen wird durch Warten besser.
Und alle vier sehen aus wie „nichts zu tun", weil nichts blinkt.

## Was der Hub damit tut — in dieser Reihenfolge

1. **Selbst belegen, wo es geht.** Ein Commit, eine PR-Nummer, ein
   Deploy-Stand, ein Blick in den Code: Wenn die Antwort im Repo steht,
   fragt man niemanden. Am 11.09. ließen sich so 13 von 25 Lücken in
   zwanzig Minuten schließen — mit dem Beleg als Grund im Eintrag.

2. **Was bleibt, fragen — sofort, und alle.** Nicht die zwei Sitzungen, die
   gerade antworten, sondern **jeden** Eigentümer, den die Liste nennt. Fünf
   Einträge an 3 Agent, zwei an 6 Agent, zwei an 5 Agent, einer an 2 Agent:
   vier Nachrichten, nicht zwei und eine Liste für später.

3. **Eigene Einträge zuerst.** Steht der Hub selbst als Owner drin, ist
   „braucht Wissen des Owners" eine Ausrede an sich selbst.

4. **Die Frage hinterlässt eine Spur im Eintrag** — eine Log-Zeile
   „nachgefragt bei X: worauf wartet das?". Dann liest der Betreiber
   *„nachgefragt"* statt *„unbekannt"*, und die zweite Uhr aus
   [[hub-fasst-nach]] läuft ab hier.

5. **Gibt es den Eigentümer nicht mehr** — Sitzung abgeschaltet,
   Name umbenannt —, dann ist die Antwort im Code zu suchen, nicht bei einem
   Adressaten, den es nicht gibt. Der Hub trägt sie ein und sagt, dass er es
   war.

## Was dem Betreiber gehört

Eine Lücke, die **nach** der Nachfrage offen bleibt, weil der Eigentümer
sie nicht schließen kann — dann ist es eine Entscheidung, und sie bekommt
einen `D-`-Eintrag mit Optionen. Nicht vorher. Eine Liste von zehn
Unbekannten ist keine Entscheidungsvorlage, sie ist unerledigte Hausarbeit.

## Die Gegenprobe

Vor dem Bericht an der Betreiber die eigene Liste lesen: Steht dort ein
Satz der Form *„habe ich nicht angefasst, weil …"*? Dann ist die Arbeit
nicht fertig. Der Satz gehört ersetzt durch *„nachgefragt bei …, Zeile im
Eintrag"* — oder durch die Antwort.
