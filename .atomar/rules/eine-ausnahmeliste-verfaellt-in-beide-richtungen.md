---
name: eine-ausnahmeliste-verfaellt-in-beide-richtungen
title: Eine Ausnahmeliste, die nur wachsen kann, deckt irgendwann Neuerfindungen
origin: operator
rank: 810
version: 1.0.0
short: "Jede Ausnahme bekommt einen Grund UND ein Ablaufdatum in Form einer Bedingung: Sobald der Grund entfällt, wird der Eintrag ROT. Eine Liste, die nur wächst, ist nach einem halben Jahr ein Freibrief, den niemand mehr liest."
---
## Der Fall, an dem sie entstanden ist

Ein Farbsystem bekam einen Token für „aktiver Zustand". Der Wert war
`#6aa8ff` — **vorgeschlagen, nicht gemessen.** Der Bestand trug für dieselbe
Rolle bereits `#7aa2ff`, 62 Mal. Die beiden liegen 16/6/0 je Kanal
auseinander; auf einem Bildschirm sind sie nicht zu unterscheiden.

**Nichts hat das gemeldet, und nichts konnte es:** Der Token war syntaktisch
gültig, alle Prüfungen grün, die Farbe „richtig" — sie war nur die zweite
ihrer Art.

> **Ein erfundener Wert sieht genauso aus wie ein gefundener.**

Das ist die Fehlerklasse. Sie betrifft Farben, Fristen, Schwellen,
Kennungen — alles, wo ein Wert plausibel aussieht, ohne dass irgendwo steht,
woher er kommt.

## Die Prüfung, die daraus folgt

Jeder Wert kommt **im Bestand vor** — oder er steht auf einer Liste, die sagt,
dass er absichtlich neu ist, **mit Grund**:

```ts
export const ABSICHTLICH_NEU: Readonly<Record<string, string>> = {
  "#22243a": "SURFACE_INTERAKTION.ruhend — den Interaktionskanal gibt es im
              Code noch nicht; ihn zu bauen IST dieses Ticket.",
};
```

Wer hier einträgt, sagt damit: *Ich habe gesucht, es gibt ihn noch nicht, und
er soll neu sein.* Das ist erlaubt. Was nicht erlaubt ist, ist es zu TUN, ohne
es zu SAGEN.

## Und jetzt der Teil, der die Regel ausmacht

Eine Ausnahmeliste, die nur wachsen kann, ist nach einem halben Jahr eine
Liste von Werten, die längst da sind — und sie **deckt dann Neuerfindungen,
statt sie zu benennen.** Genau das, wogegen sie gebaut wurde.

Also verfällt sie in **beide** Richtungen:

```ts
test("die Ausnahmeliste verfällt, sobald ein Wert im Bestand angekommen ist", () => {
  const veraltet = Object.keys(ABSICHTLICH_NEU).filter((w) => BESTAND.includes(w));
  assert.deepEqual(veraltet, [],
    "diese Werte stehen als ABSICHTLICH NEU da, kommen aber inzwischen vor — " +
    "der Eintrag hat seinen Zweck erfüllt und gehört heraus");
});
```

**Damit erzählt die Liste immer die Wahrheit über sich selbst.** Ein Eintrag,
dessen Grund entfallen ist, meldet sich; niemand muss daran denken, ihn zu
entfernen.

## Woran man erkennt, dass eine Ausnahmeliste die Form noch nicht hat

- **Sie hat keine Gründe**, nur Werte. Dann ist sie ein Freibrief, und der
  nächste hängt seinen Wert unbesehen an.
- **Sie hat Gründe, aber keine Bedingung.** Dann steht in einem Jahr ein Grund
  da, den es nicht mehr gibt, und er sieht aus wie einer, den es gibt.
- **Sie ist nur je Eintrag geprüft, nicht als Ganzes.** „Jeder Eintrag hat
  einen Grund" ist eine Prüfung auf Anwesenheit; sie kann eine Auslassung
  nicht finden und einen entfallenen Grund erst recht nicht.

## Die Gegenprobe

Drei Mutationen, und alle drei müssen rot werden:

1. **Der Ursprungsfehler zurück** — der erfundene Wert steht wieder da, ohne
   Eintrag auf der Liste.
2. **Ein vorhandener Wert wandert auf die Liste** — jemand erklärt etwas für
   neu, das es längst gibt.
3. **Ein Grund wird ausgehöhlt** — aus der Begründung wird „neu".

Bleibt eine davon grün, prüft die Liste sich nicht, sondern beschreibt sich.

## Was das NICHT ist

Kein Argument gegen Ausnahmen. Ausnahmen sind nötig — ein System ohne sie
wird umgangen statt befolgt, und eine Prüfung, die den Normalfall verbietet,
wird abgeschaltet. Die Frage ist nur, ob die Ausnahme **sagt, warum sie da
ist, und merkt, wann sie es nicht mehr ist.**
