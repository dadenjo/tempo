---
name: vier-arten-blinder-gegenproben
title: Eine Gegenprobe kann auf sechs Arten blind sein — vier davon sehen aus wie bestanden
origin: operator
rank: 805
version: 1.0.0
short: "Eine Mutation, die gruen bleibt, ist das Ergebnis, kein Nebenbefund. Blind sein koennen: die ZUSICHERUNG, der BESTAND, die FRAGE, die REICHWEITE — dazu die Aenderung am falschen ORT und die SUMME, die stimmt, waehrend eine Frage fehlt."
---

Eine Gegenprobe soll zeigen, dass eine Prüfung scheitern **kann**. Sie kann
aber selbst auf vier verschiedene Arten blind sein — und drei davon sehen
aus wie eine bestandene Prüfung.

**Alle vier sind am 10.09.2026 an einem einzigen Abend aufgetreten, alle
vier in meiner eigenen Arbeit, und keine einzige wurde von einem roten Test
gefunden.** Gefunden hat sie die Mutation: der Griff, der absichtlich kaputt
macht, was die Prüfung halten soll.

## Die vier Formen

**1 — Die PRÜFUNG ist blind.** Sie bewacht die Zahl, nicht die Stelle, aus
der die Zahl folgt.

> `ETIKETT_ZEICHEN` war an `LINKS` gebunden und zugesichert. Ich habe `LINKS`
> von 560 auf 900 gesetzt: die Beschriftung breiter als das halbe Bild, dem
> Raster 144 von 1060 Einheiten, jeder Balken auf einen Strich
> zusammengeschoben — **alle sechzehn Zusicherungen blieben grün.** Bewacht
> war das Zeichenbudget, nicht die AUFTEILUNG, aus der es folgt.

**2 — Die EINGABE ist blind.** Der Testbestand ist so gebaut, dass beide
Antworten dasselbe ergeben.

> Ein Wachtposten meldet das Alter des ÄLTESTEN fehlenden Commits. Die
> Mutation zurück auf `git log -1 --reverse` (das den NEUESTEN liefert)
> blieb grün — weil in meinem Testbaum **alle Commits dasselbe Datum
> trugen**. Ältester und neuester konnten gar nicht auseinanderfallen.

> **Ein Testbestand, dessen Fälle in beide Richtungen dasselbe ergeben, kann
> nur bestätigen.**

**3 — Die Prüfung fragt ETWAS ANDERES, als die Funktion beantwortet.** Sie
ist rot, und der Code hat recht.

> Ich wollte belegen, dass `unsecuredAtomar` frisch holt, und legte eine
> NEUE Datei auf dem Fernziel an. Sie taucht nicht auf — richtig so: die
> Funktion meldet ÖRTLICHE Arbeit, die noch nicht veröffentlicht ist, nicht
> fremde, die noch nicht geholt wurde. **Der Test war rot, die Funktion in
> Ordnung.** Wer da nicht innehält, repariert etwas Heiles.

**4 — Die Prüfung sucht am FALSCHEN ORT.** Sie findet etwas, aber nicht
dort, wo die Fehlerklasse wohnt.

> Ein Scanner prüft, dass jeder genannte Befehl existiert. Ich habe ihn so
> mutiert, dass er nicht mehr in Unterverzeichnisse steigt — **alle
> Zusicherungen blieben grün.** Ausgerechnet: der Verweis, der den Eintrag
> ausgelöst hatte, stand in `lib/git.mjs`, nicht in `cli.mjs`. Bewacht war,
> DASS etwas gefunden wird — nicht, WO gesucht wird.

## Warum das eine eigene Regel ist

`die-gegenprobe` sagt, dass man brechen muss, was eine Prüfung halten soll.
Diese hier sagt, **woran man merkt, dass die Gegenprobe selbst nichts
beweist.** Eine grün gebliebene Mutation ist kein Nebenbefund — sie ist das
Ergebnis.

Die Formen 1 und 4 sind verwandt und nicht dieselbe: Bei 1 ist die
ZUSICHERUNG zu eng, bei 4 die REICHWEITE. Form 2 sitzt in der Eingabe, Form
3 in der Fragestellung. Wer nur an „mehr Testfälle" denkt, deckt 2 ab und
keine der anderen drei.

## How to apply

- **Zähle den TREFFER, nicht nur den Lauf.** Ein Mutationsskript, das nicht
  meldet, ob das Muster genau einmal gegriffen hat, lässt eine nicht
  angekommene Mutation als bestandene Gegenprobe durchgehen. Bei mir hat
  genau das einmal zugeschlagen (0 Treffer, grüner Lauf danach).
- **Eine grün gebliebene Mutation wird NICHT weggeklärt.** Sie zeigt eine
  Lücke — entweder in der Zusicherung (1), im Bestand (2), in der Frage (3)
  oder in der Reichweite (4). Die Lücke wird geschlossen, nicht die Mutation
  verworfen.
- **Sichere zu, dass die Aufzählung etwas FINDET.** Ein Wächter über einer
  leeren Liste meldet immer bestanden: `const dateien = []` muss rot sein.
- **Sichere zu, WO gesucht wird** — nicht nur, dass etwas gefunden wurde.
  Eine Liste, die `cli.mjs` enthält und `lib/` nicht, sieht vollständig aus.
- **Bau den Bestand so, dass die falsche Antwort eine ANDERE wäre.**
  Verschiedene Daten, verschiedene Werte, verschiedene Längen — sonst prüft
  man die Gleichheit zweier Wege, nicht die Richtigkeit eines.
- **Bei einem roten Test zuerst fragen, ob die Prüfung die richtige Frage
  stellt.** Nicht jeder rote Test ist ein Fehler im Code.

## Und eine fünfte, die nicht die Prüfung betrifft, sondern den ORT

**Eine Regel wird in der mitgelieferten Quelle geändert, nicht in der Kopie
im Projekt.** `tools/atomar-backlog/regelwerk/` ist die Quelle — sie trägt
Platzhalter wie `der Betreiber` und reist in fremde Projekte.
`.atomar/rules/` ist die daraus erzeugte Fassung für DIESES Projekt.

Am 10.09.2026 habe ich die Kopie bearbeitet und veröffentlicht. Es ging
gut, weil `uebernehmen` den Absatz korrekt in die Quelle zurücktrug —
**aufgefallen ist es mir nur an einer Zeile im `git diff --cached
--numstat`**, die eine Datei zeigte, die ich nicht angefasst hatte. Ohne
diesen Blick wäre die Regel im eigenen Projekt richtig gewesen und in
jedem anderen nie angekommen.

Das ist dieselbe Klasse wie zwei Buchführungen über dieselbe Sache — nur
zwischen Projekt und Werkzeug statt innerhalb einer Datei. Und sie ist
besonders still, **weil das Ergebnis im eigenen Projekt richtig aussieht.**

## Und eine sechste, beim UMBAU: die Summe stimmt und die Frage fehlt

**Eine Summe, die stimmt, ist kein Beleg dafür, dass dieselben Fragen noch
gestellt werden.**

Am 10.09.2026, beim Umbau der Zeitleiste (T-265): Die Auflage lautete, die
Zahl der grünen Zusicherungen vorher und nachher zu melden — „ich habe sie
angepasst" ist keine Messung. Die Zahlen waren **638 vorher, 638 nachher.**

Sie stimmten, weil ich acht Zusicherungen entfernt und acht angelegt hatte.
Unter den entfernten war ausgerechnet die, die eine frühere Gegenprobe
erzwungen hatte (*„dem Raster bleibt ein brauchbarer Anteil"*, aus Form 1).
Sie hatte danach **keine Nachfolgerin** — und die Summe sagte nichts davon.

Gemerkt habe ich es nur, weil ich die entfallenen **einzeln durchgegangen**
bin statt die Summe zu vergleichen.

**How to apply, für jeden Umbau, der Zusicherungen berührt:**

- **Zähle nicht die Summe, sondern führe die Liste.** Jede entfallene
  Zusicherung bekommt eine benannte Nachfolgerin, die dieselbe Frage stellt
  — oder eine ausdrückliche Begründung, warum die Frage weggefallen ist.
- **Die Zuordnung gehört in die Meldung**, nicht in den Kopf dessen, der
  umgebaut hat. Sie ist das Einzige, was ein Leser nachprüfen kann.
- **Besonderer Verdacht gilt Zusicherungen, die aus einer Gegenprobe
  entstanden sind.** Sie sind per Bauart die, die als Einzige eine bestimmte
  Lücke bewachen — und die, an die beim Umbau niemand denkt, weil sie
  nachträglich dazukamen und nirgends „dazugehören".

