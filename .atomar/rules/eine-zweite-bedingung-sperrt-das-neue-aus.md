---
name: eine-zweite-bedingung-sperrt-das-neue-aus
title: Eine zweite Bedingung neben der eigentlichen tut nur dann etwas, wenn sie falsch ist
origin: operator
rank: 45
version: 1.0.0
short: "Steht die Antwort schon in den Daten, ist die zusaetzliche Abfrage davor kein Schutz, sondern eine Sperre. Sie kostet nichts, solange nichts Neues dazukommt — und sperrt genau das Neue aus, sobald es kommt."
---
## Der Fall

08.09.2026, Film-Bench. `RoadFrame` traegt seit jeher szenenneutrale,
optionale Nutzlasten: `arcade`, `arcadeEvent`, `medal`, `ghost`, `fork`. Die
Seite rendert jede davon so:

```tsx
{sceneId === "arcade" && hudVisible && frame.fork ? … }
```

**Die Szenenabfrage ist ueberfluessig.** Ob ein Overlay erscheint, steht
bereits in `frame.fork` — eine Szene, die die Nutzlast setzt, WILL sie
zeigen, sonst haette sie sie nicht gesetzt.

Die zusaetzliche Bedingung konnte genau eines: **eine neue Szene aussperren,
die dieselbe Nutzlast liefert.** Die Umfrage-Szene setzt `frame.fork` fuer
die Frage an der Gabel und heisst nicht `arcade` — sie waere daran
haengengeblieben, ohne Fehler, ohne Meldung, einfach unsichtbar.

Drei solche Abfragen entfernt. Danach brauchte weder die Umfrage einen
Sonderfall noch die Story-Welt (T-215) einen vierten. **Die gemeinsame Form
war da, sie war nur zugesperrt.**

## Warum es sich nicht wie ein Fehler anfuehlt

Weil die Bedingung stimmt. Sie ist heute wahr, sie war es gestern, und ihr
Autor hat sie in gutem Glauben geschrieben — als Praezisierung, nicht als
Sperre. Sie kostet nichts, solange es nur einen Fall gibt.

**Der Schaden entsteht erst beim zweiten**, und dann sieht er nicht wie eine
Sperre aus, sondern wie "das Overlay geht in der neuen Szene nicht". Wer das
untersucht, sucht im Overlay.

## Die Familie

Am selben Tag dreimal dieselbe Form, an drei verschiedenen Stellen:

| Stelle | die ueberfluessige zweite Bedingung |
|---|---|
| `film-road/page.tsx:132` | eine zweite Szenenliste neben `SCENES` |
| `umfrageAntwort.ts` | vier Fehlerwege, die alle `nichts` ergaben |
| die drei Overlay-Abfragen | `sceneId === "arcade" &&` vor der Nutzlast |

Verwandt, aber nicht dasselbe: `eine-liste-neben-ihrem-original`. Dort
veraltet eine Kopie. Hier ist nichts veraltet — die Bedingung stimmt, sie
ist nur enger als die Sache, die sie beschreibt.

**How to apply:**
- Vor jeder Bedingung, die eine KENNUNG abfragt (Szene, Modus, Typ, Name):
  **Steht die Antwort schon in den Daten?** Wenn ja, ist die Abfrage eine
  Sperre gegen alles, was noch nicht existiert.
- Wer eine neue Variante einbaut und sie erscheint nicht: **erst nach einer
  Kennungsabfrage suchen**, dann im Renderer.
- Und beim Schreiben: Eine Nutzlast, die gesetzt ist, ist die Absicht. Wer
  danach noch fragt, WER sie gesetzt hat, misstraut dem eigenen Modell.
