---
name: zwischen-befund-und-auge-sitzt-etwas
title: Zwischen dem Befund und dem, was du liest, sitzt etwas — und es schweigt
origin: operator
rank: 33
version: 1.0.0
short: "Fünfmal an einem Tag hat nicht die Prüfung gelogen, sondern der Weg von ihr zum Auge: eine gekürzte Ausgabe, ein verschluckter Exit-Code, ein Puffer, eine leere Leinwand. Die Fehlerarten sind verschieden, die Bewegung ist immer dieselbe."
---
## Fünf Fälle, 06.09.2026, ein Tag

| was gelesen wurde | was dazwischensass |
|---|---|
| „drei Tests rot" | `\| tail -20` — nur die letzte Zeile der Ausgabe |
| „exit 0, also grün" | `\| head` — gemessen wurde `head`, nicht die Prüfung |
| „gh pr merge durchgelaufen" | eine Absage des Classifiers, die als Erfolg gelesen wurde |
| „der Baum ist frei" | `npm test` puffert bis zum Ende — ein laufender Lauf sieht aus wie keiner |
| „die Canvas wurde erzeugt" | jenseits von 2^24 kommt sie **leer** zurück, ohne Fehler |

**Drei davon gingen in die eine Richtung** (eine Absage wurde als Erfolg
weitergegeben), **zwei in die andere** (ein Erfolg wurde als Fehler gelesen).
Beide Richtungen kosten dasselbe: Arbeit an einem Zustand, den es nicht gibt.

## Warum es sich nicht wie ein Fehler anfühlt

Die Prüfung war jedes Mal richtig. Der Code war richtig. **Falsch war nur der
Weg von der Prüfung zum Auge** — und dieser Weg hat keinen Namen, kein Ticket
und keine Zeile im Bericht. Er besteht aus Bequemlichkeiten: eine Pipe, damit
die Ausgabe kürzer wird; ein Hintergrundlauf, damit man weiterarbeiten kann.

Und er meldet sich nie. **Eine gekürzte Ausgabe sieht aus wie eine kurze
Ausgabe.**

## Die Regel

- **Nie eine Prüfung durch `head`, `tail` oder ein `grep` beurteilen, das
  ihren Ausgang tragen soll.** Filtern zum Anschauen: ja. Filtern und dann
  über bestanden/durchgefallen entscheiden: nein.
- **Den Exit-Code der PRÜFUNG messen, nicht den der Pipe.** In einer Pipe ist
  `$?` der Status der letzten Stufe.
- **Was Erfolg meldet, wird am Gegenstand nachgesehen** — nicht an der
  Meldung. Ein `merge`, das durchläuft: ist der PR wirklich `MERGED`? Eine
  Canvas, die entsteht: ist ein Pixel in ihrer äußersten Ecke auslesbar?
- **Und wer eine Zahl weitergibt, gibt weiter, woran er sie abgelesen hat.**
  Eine weitergegebene Absage lässt eine andere Sitzung auf einem Stand bauen,
  den es nicht gibt — das ist an diesem Tag einmal passiert.

## Die Frage, die davor steht

Dieselbe Form wie bei [[richtig-gezaehlt-ueber-die-falsche-menge]]:

> **Wenn diese Prüfung gerade fehlgeschlagen wäre — sähe meine Ausgabe
> anders aus?**

Bei allen fünf Fällen war die Antwort nein. Und in allen fünf Fällen hätte
man sie in einem Satz beantworten können, bevor man gelesen hat.

Verwandt: [[etwas-das-erfolg-meldet-und-nichts-tut]],
[[ein-negativer-befund-misst-den-messplatz]], [[die-gegenprobe]].
