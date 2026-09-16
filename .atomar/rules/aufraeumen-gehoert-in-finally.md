---
name: aufraeumen-gehoert-in-finally
title: Aufräumen gehört in `finally`, nicht hinter die Zusicherung
origin: operator
rank: 320
version: 1.0.0
short: "Steht das Schließen hinter der Prüfung, verwandelt der erste echte Fehlschlag den Test in einen Stillstand — und ein Stillstand nennt seine Ursache nicht."
---
## Der Fall

6 Agent, 05.09.2026. Eine Änderung ließ zwei Zusicherungen **zu Recht**
scheitern. Statt rot zu werden, **hing die ganze Suite**:

```js
const res = await fetch(...);
assert.match(body, /· der Betreiber · …/);       // scheitert
await new Promise((r) => eigen.close(r));  // wird NIE erreicht
```

Der Server blieb offen, der Prozess endete nie. Zwanzig Minuten, um von
„die Suite hängt" auf „zwei Zusicherungen sind rot" zu kommen — erst
gegen `origin/main` messen, dann innerhalb der Datei bisektieren.

## Warum das teurer ist als ein roter Test

Ein roter Test **nennt seine Ursache**: Datei, Zeile, erwarteter und
tatsächlicher Wert. Ein Stillstand nennt gar nichts. Und in einer Suite,
die sonst in Sekunden läuft, sieht ein Hang aus wie ein hängender
Rechner — also sucht man zuerst am falschen Ort.

Der Schaden entsteht dabei **genau dann, wenn man ihn am wenigsten
gebrauchen kann**: beim ersten echten Fehlschlag, also in dem Moment, in
dem der Test das erste Mal seinen Zweck erfüllt.

## Die Regel

Alles, was ein Test aufmacht — Server, Datei, Prozess, Verbindung —
schließt er in `finally`. Nicht hinter der letzten Zusicherung, nicht am
Ende des Blocks, nicht „passiert schon".

## Verwandt

Dieselbe Familie wie [[die-gegenprobe]]: Ein Test, dessen Scheitern man
nicht sieht, ist so viel wert wie ein Test, der nicht scheitern kann.
