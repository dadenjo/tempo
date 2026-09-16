---
name: der-dateiname-verraet-was-die-zahl-verbirgt
title: Beim Prüfen eines PR ist die Zahl der schwächere Fühler, der Dateiname der starke
origin: operator
rank: 42
version: 1.0.0
short: "Ein Diff wird nach NAMEN gelesen, nicht nach Größe. Fremde Arbeit im eigenen PR fällt nicht durch eine auffällige Zeilenzahl auf, sondern durch eine Datei, die man nie angefasst hat."
---
## Der Fall

Am 08.09.2026 lag ein Zweig hinter `origin/main`, weil sein PR zwischendurch
gemergt worden war. Ein zweiter PR von demselben Zweig hätte getragen:

```
apps/pixel-peloton/scripts/release-check.sh | 53 ++------
```

Eine Datei, die der Autor **nie angefasst hatte**, überwiegend Löschungen — in
Wahrheit die Deckungsprüfung, die jemand anderes am selben Vormittag
eingebaut hatte. Sie wäre unter fremdem Namen zurückgenommen worden.

## Warum die Größenprüfung geschwiegen hätte

Der Diff meldete **27 Dateien und 1530 Einfügungen**. Beides plausibel: Der
Tag war lang, es waren neun Commits, mehrere neue Testdateien. Die Regel „ein
Sechs-Dateien-Wechsel darf keine Tausenden von Zeilen melden" greift hier
nicht — die Zahlen *passten* zur geleisteten Arbeit.

Aufgefallen ist es an einer Zeile, die man nicht rechnen muss:
`release-check.sh` stand da, und der Autor wusste ohne Nachdenken, dass diese
Datei nicht seine ist.

## Die Ergänzung

**Die Zahl ist der schwächere Fühler.** Sie schlägt nur an, wenn das Fremde
*größer* ist als das Eigene — bei einem langen Tag oder einer kleinen fremden
Änderung schweigt sie.

**Der Name ist der starke.** Die Liste der Dateien in einem PR ist kurz genug,
um sie ganz zu lesen, und die Frage dazu braucht kein Werkzeug: *Habe ich
diese Datei angefasst?* Wer sie nicht mit Ja beantworten kann, hat den Fund
schon gemacht.

```bash
git diff --name-only origin/main...HEAD    # zuerst, und ganz lesen
git diff --numstat origin/main...HEAD | sort -rn | head   # danach
```

## Und die Ursache dahinter

Ein Zweig, dessen PR gemergt wurde, ist danach **hinter** `main` — auch wenn
er sich unverändert anfühlt. Jede Verbesserung, die seither auf `main` landete,
erscheint im Diff als Löschung.

Nach einem Merge des eigenen PR wird nicht weitergearbeitet, sondern **neu
geschnitten**: `git switch -c <neu> origin/main`, dann die eigenen Commits
einzeln übertragen. Der Umfang danach ist der Beweis — im Fall oben fielen 27
Dateien auf 14, und `release-check.sh` verschwand.
