---
name: zuerst-ansehen-dann-messen
title: Zuerst ansehen, dann messen — das Auge findet die Klasse, die Messung findet die Zahl
origin: operator
rank: 31
version: 1.0.0
short: "Eine Messung beantwortet die Frage, die jemand gestellt hat. Welche Frage fehlt, sieht nur ein Mensch. Am 06.09. hat die Prüfung dreimal die Wahrheit gesagt und dreimal den Fehler nicht gefunden — gefunden hat ihn jedes Mal ein Blick auf den Bildschirm."
---
## Der Tag

06.09.2026, Werbemotive. Drei Klassen von Fehlern kamen dazu, **alle drei
angestoßen von der Betreiber, der hinsah** — keine von der Prüfung:

| er sah | die Prüfung meldete | tatsächlich |
|---|---|---|
| „die Adresse ist komisch im Bild" | 7 Überschneidungen | **15** Motive mit Inhalt unter der Adresse |
| „Daily Mix ist kaputt" | **0** für dieses Motiv | Text auf einem Kasten, der sich nie angemeldet hatte |
| „Pixel Watts klebt darunter" | keine Überschneidung | Abstand **14 px**, Median sonst 71 |

**Die Prüfung war jedes Mal korrekt.** Sie hat nur über eine engere Frage die
Wahrheit gesagt.

2 Agents Fassung, und sie ist die schärfere:

> **„Die Prüfung meldet null" ist nie eine Antwort auf „sieht es gut aus".
> Es ist eine Antwort auf „ist die Frage, die ich gestellt habe, verletzt".**

## Und die Sammelkarte ist derselbe Fall, zwei Tage lang

Wir haben einzelne Textfelder gegen die Sicherheitszone gemessen — richtig
gerechnet, zwei Tage lang. **Das Problem war der goldene Rahmen**, und es fiel
in zehn Minuten auf, nachdem jemand das Bild angesehen hatte.

## Die Reihenfolge

1. **Ansehen.** Rendern, hinschauen, benennen was stört. Das kostet Minuten.
2. **Die Klasse benennen**, die dahintersteckt — nicht den Einzelfall.
3. **Messen**, wie oft sie vorkommt. Erst hier ist eine Zahl etwas wert.
4. **Reparieren**, an einer Stelle.

Wer bei 3 anfängt, misst gut und findet nichts Neues.

## Was das NICHT heißt

Keine Absage an die Messung. **Ohne sie wäre aus „die Adresse ist komisch" ein
Fix an fünf Motiven geworden statt an fünfzehn** — das Auge findet die Klasse,
es zählt sie nicht. Beide Schritte sind nötig, nur in dieser Reihenfolge.

## Und der Zusatz, der es unangenehm macht

**Das Auge findet die Klasse auch dann, wenn die Messung korrekt ist.** Eine
grüne Zahl ist deshalb kein Grund, das Ansehen zu überspringen — sie ist
genau der Zustand, in dem man es überspringt.

Verwandt: [[richtig-gezaehlt-ueber-die-falsche-menge]],
[[ein-negativer-befund-misst-den-messplatz]], [[die-gegenprobe]].

## Und das Auge hat seinen eigenen blinden Fleck — in die andere Richtung

2 Agent, 06.09.2026, beim ersten bewussten Durchgang mit gerenderten Bildern.
Im Quiz standen dort:

```
„Tadej Poga▯ar"     statt Pogačar
„Primo▯ Rogli▯"     statt Roglič
```

**Ein Quiz ueber Radfahrer mit zerstoerten Fahrernamen** — sie haette es fast
gemeldet. Nachgeprueft im echten Browser: Dort hat `č` normale Breite. **Es ist
ein Artefakt des Renderers** (`@napi-rs/canvas` fehlt das Glyph, Chromium hat
es).

Ohne die Gegenprobe waere eine Stunde in einer Schriftliste gesucht worden.

### Die zwei Werkzeuge luegen in entgegengesetzte Richtungen

| | Fehler |
|---|---|
| **Die Messung** | meldet **zu wenig** — sie kennt nur die Fragen, die jemand gestellt hat |
| **Das Rendern** | meldet bei Sonderzeichen **zu viel** — Glyphen, die nur ihm fehlen |

**Ein Bildschirmfoto aus dem eigenen Renderer ist fuer LAYOUT gueltig und fuer
SCHRIFTZEICHEN nicht.** Wer Zeichen beurteilen will, prueft sie im Browser
nach.

### Und daraus folgt eine Asymmetrie fuer Meldungen

**Was der Betreiber an kaputten Zeichen sieht, ist ECHT** — er sieht den
Browser. Was wir an kaputten Zeichen sehen, ist erst ein Verdacht.

Umgekehrt beim Layout: Da ist unser Rendern so gueltig wie sein Bildschirm,
und wir haben keine Ausrede, ihn suchen zu lassen.
