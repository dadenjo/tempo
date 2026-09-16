---
name: eine-nummer-wird-vergeben-nicht-benutzt
title: Eine Kennung wird VERGEBEN, nicht benutzt — und eine Veröffentlichung, die löscht, ist keine
origin: operator
rank: 31
version: 1.0.0
short: "Wer eine Nummer selbst wählt, umgeht jede Vergabeprüfung — auch die, die genau dagegen gebaut wurde. Und wer beim Veröffentlichen eine Löschzahl sieht und trotzdem drückt, überschreibt fremde Arbeit mit der eigenen Fassung."
---
## Zwei Fälle an einem Tag, derselbe Griff

**06.09.2026, nachmittags.** 5 Agent NANNTE ihre Arbeit „T-123" und „T-124",
ohne Einträge anzulegen, während der Verteiler dieselben Nummern regulär
vergab. Ein bereits gemergter PR trägt seither die falsche Nummer im Titel.

**06.09.2026, abends.** 2 Agent schrieb `D-046.md` von Hand. **D-046 war seit
20:06 vergeben** — „Outrun-Biom", über die CLI angelegt und veröffentlicht. Die
Datei überschrieb sie auf `main`.

Ihre eigene Messung danach: **zehn Einträge an diesem Tag von Hand
geschrieben**, die Nummer mit `git ls-tree | tail` geraten. Neunmal war sie
zufällig frei.

> **Das ist kein mildernder Umstand, das ist Glück — und es hat den Fehler
> zehnmal unsichtbar gehalten, bis er einmal traf.**

## Warum die bestehende Sperre nicht greift

T-108 hat die Vergabe gegen genau diesen Zusammenstoß gesichert: `create()`
liest vor der Vergabe `origin/main`, nicht nur das eigene Verzeichnis.

**Diese Sperre schützt den Weg durch die CLI.** Eine Datei, die daneben von
Hand entsteht, sieht sie nie — sie wird nicht VERGEBEN, sie wird BENUTZT.

| | |
|---|---|
| geprüft wird | wer eine Nummer **zieht** |
| unsichtbar bleibt | wer eine Nummer **verwendet** |

## Die Regel

- **Einträge entstehen über `tools/atomar-backlog/cli.mjs`.** Sie vergibt `id`
  und `rank`, und sie hat ein `sichern`, das `.atomar/backlog` über benannte
  Pfade committet. Wer sich das mit `commit-tree` selbst nachbaut, hat nicht
  gesucht ([[erst-suchen-dann-bauen]]).
- **Eine Nummer in einem PR-Titel, einer Nachricht oder einem Commit ist keine
  Vergabe.** Solange keine Datei existiert, gibt es den Eintrag nicht
  ([[was-nicht-im-backlog-steht]]).
- **Der Wachtposten `pruefe-kennungen.mjs` meldet kopflose Dateien und Köpfe,
  deren `id` dem Dateinamen widerspricht.** Seine Grenze steht in seinem Kopf:
  von den zehn Fällen oben fände er zwei.

## Und die zweite Hälfte: die Löschzahl

Der Verteiler veröffentlichte danach „vier Logzeilen" und las in seiner eigenen
Bilanz:

```
.atomar/backlog/D-046.md | 101 +++----
1 file changed, 39 insertions(+), 62 deletions(-)
```

**Er hat gedrückt.** Und beim „Zurücksetzen" danach hat er der Nachricht der
Schwestersitzung geglaubt statt `git log` zu fragen — und die falsche Fassung
wiederhergestellt. Aus einem Fehler wurden drei.

### Die Regel

- **Eine Veröffentlichung von Logzeilen kann nur HINZUFÜGEN.** Jede Löschzahl
  über null ist ein Abbruchgrund, kein Detail — die Bilanz steht vor dem Push,
  damit sie gelesen wird ([[die-gegenprobe]]).
- **Wer eine Kollision repariert, misst zuerst, wer zuerst da war.** `git log
  origin/main -- <pfad>` beantwortet es in fünf Sekunden. Die Angabe einer
  anderen Sitzung ist eine Behauptung, keine Messung
  ([[eine-widerlegung-ist-auch-eine-messung]]).
- **Und beide Fassungen bleiben erhalten.** Die jüngere bekommt eine neue
  Nummer, die ältere behält ihre — nichts wird gelöscht, um Ordnung
  herzustellen.
