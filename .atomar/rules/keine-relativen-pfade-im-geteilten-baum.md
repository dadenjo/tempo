---
name: keine-relativen-pfade-im-geteilten-baum
title: Keine relativen Pfade in einem geteilten Baum
origin: operator
rank: 70
version: 1.0.0
short: "`cd ..` hat kein Ziel, sondern eine Richtung — wo man landet, hängt davon ab, wo man vorher stand. In einem Verzeichnis mit Hauptcheckout und mehreren Arbeitsbäumen ist das ein Würfel. Absolute Pfade oder `git -C <pfad>`."
---
## Der Fall

2 Agent, 05.09.2026. Ein relatives `cd ..` traf den **Hauptcheckout**, und
dort lief ein `git commit` an. Er brach an den Pfadangaben ab.

Hätte er nicht abgebrochen, wäre in dem Verzeichnis committet worden, in
dem gerade fünf Sitzungen arbeiten — und in dem am selben Tag 88
unversionierte Backlog-Dateien nur knapp gerettet wurden.

Ihre eigene Einordnung, die schärfer ist als jede fremde:

> *„Gerettet hat mich ein Zufall, nicht meine Sorgfalt."*

## Warum „vorsichtiger sein" keine Maßnahme ist

Ein relativer Pfad ist nicht gefährlich, weil man unaufmerksam ist. Er ist
gefährlich, weil sein Ziel **vom Zustand abhängt** — und der Zustand ist
in einer langen Sitzung mit mehreren Bäumen nicht im Kopf.

## Die Regel

- **Absolute Pfade**, oder `git -C <absoluter pfad>`.
- Nach jedem Verzeichniswechsel, der doch passiert ist: `pwd` und
  `git branch --show-current`, bevor irgendetwas schreibt.
- Und wenn etwas schiefgegangen sein könnte: **messen, nicht hoffen.**
  2 Agent hat nachgesehen — `HEAD` unverändert, kein Reflog-Eintrag — und
  wusste danach, dass nichts passiert ist, statt es anzunehmen.

## Und derselbe Fehler mit einer MESSUNG als Gegenstand

Die Regel oben spricht von Skripten und Befehlen. Sie gilt genauso für das
**Nachsehen** — und dort ist sie gefährlicher, weil eine falsche Messung
nicht abbricht. Sie antwortet.

> **Eine Messung gilt immer nur für den Baum, in dem sie läuft.**
> *(6 Agent, 05.09.2026)*

### Zwei Fälle vom selben Tag, beide mit Zahlen

**Das Regelwerk selbst, 3 Agent.** `.atomar/` ist unversioniert
(`.gitignore:41`), also trägt jeder Arbeitsbaum seine eigene Kopie, und die
älteren bleiben stehen:

| | Regeln gesamt | davon bis Rang 100 |
|---|---:|---:|
| `/tmp/kurs` (Arbeitsbaum) | 18 | **3 von 13** |
| Hauptcheckout | 34 | 13 von 13 |

Es fehlten unter anderem Rang 5 (die, die das Nachlesen anordnet), Rang 10
(die wichtigste) und Rang 80 (die, die dieselbe Sitzung am selben Tag
geschrieben hatte). Ein Regelwerk, das die Regel nicht enthält, sich selbst
nachzulesen, kann sich nicht selbst reparieren.

Gelesen wurde trotzdem richtig — aber nur, weil in Rang 5 ein **absoluter**
Pfad steht. Stünde dort ein relativer, wäre der Ausgang gewesen: zehn von
dreizehn Regeln ungelesen, und die Meldung „ich habe alle gelesen".

**Ein `git check-ignore`, 6 Agent.** Dieselbe Abfrage im zurückliegenden
Hauptcheckout meldete „alles ignoriert" — richtig gerechnet, für die
`.gitignore`, die **dort** lag. Auf `origin/main` war sie längst repariert.
Wer dort aufgehört hätte, hätte eine bereits behobene Sache noch einmal
gebaut.

Zwei verschiedene Ursachen, dieselbe Antwort, beide Male plausibel.

### Warum das schlimmer ist als ein falscher Schreibpfad

Ein Skript im falschen Baum **bricht ab** oder richtet sichtbaren Schaden an.
Eine Messung im falschen Baum liefert eine Zahl, die stimmt — für den falschen
Gegenstand. Und dann wird sie zum Beleg: Die Liste, die laut Rang 5 „der Beleg
ist, dass keine Regel übersehen wurde", zählt, **was im Ordner liegt**, nicht
was es gibt. Sie wäre der Beleg für das Gegenteil gewesen.

Das ist die Familie aus [[waechter-die-nichts-bewachen]], nur ohne Test: eine
Prüfung, die ihren eigenen Ausschnitt für die Welt hält.

### Was daraus folgt

- **Wo etwas GILT, wird mit absolutem Pfad gelesen** — Regelwerk, Backlog,
  Konfiguration. Nicht im eigenen Baum, auch nicht „weil es dort auch liegt".
- **Vor jeder Messung an geteiltem Bestand: wie weit liegt dieser Baum
  zurück?** `git rev-list --count HEAD..origin/main`. Eine Null ist die
  Voraussetzung dafür, dass die Zahl etwas über die Sache sagt und nicht über
  den Ort.
- **Eine Zählung nennt ihren Ort mit.** „18 Regeln" ist keine Aussage;
  „18 Regeln in `/tmp/kurs`" ist eine.
