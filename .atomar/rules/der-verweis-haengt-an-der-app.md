---
name: der-verweis-haengt-an-der-app
title: Der Verweis hängt an der App — die Arbeit wandert
origin: operator
rank: 45
version: 1.0.0
short: "Ein Wegwerf-Baum bekommt seine Modulordner je APP verlinkt. Wandert die Arbeit in eine zweite App desselben Baums, fehlt deren Verweis — und der Lauf meldet „fail\" statt „nicht geladen\"."
---
## Der Fall

3 Agent, 07.09.2026. Ihr Wegwerf-Baum trug zwei Verweise:

```
node_modules                      → haupt/node_modules             ✓
apps/prism-mobile/node_modules    → haupt/apps/prism-mobile/…      ✓
apps/pixel-peloton/node_modules   FEHLT
```

**Der Baum war vollständig — für die Arbeit, für die er entstand.** Sie hatte
ihn früh für T-119 angelegt, und das ist `prism-mobile`.

**Dann wanderte die Arbeit.** T-142 und T-169 waren `pixel-peloton`, im selben
Baum. Der Verweis wanderte nicht mit, und nichts hat es gesagt.

## Was der Lauf stattdessen meldete

> `6403 Tests, 6393 grün, 10 rot`

Zehn Dateien, die an `Cannot find module '@pixel-peloton/shared-config'`
scheiterten — beim **Laden**, nicht beim Prüfen. Mit dem fehlenden Verweis
nachgeholt: **99 Tests, 99 grün.**

**Neunundneunzig Prüfungen haben in jedem Lauf dieses Tages nicht existiert**,
und die Zusammenfassung sagte „10 fail" — das liest sich wie zehn kaputte
Prüfungen, nicht wie zehn Dateien, die nie geladen wurden.

## Warum „vergiss den zweiten Verweis nicht" die falsche Lehre wäre

Das Rezept in `CLAUDE.md` schreibt `apps/<app>/node_modules` mit Platzhalter —
**einen Verweis, für die App, an der man arbeitet.** Es war richtig angewandt.
Falsch wurde es erst, als dieselbe Sitzung im selben Baum eine zweite App
anfasste.

**Der Verweis hängt an der App. Die Arbeit wandert. Der Verweis nicht.**

## Die Gegenprobe, und sie kostet Sekunden

```bash
ls apps/<app>/node_modules/        # vor dem ERSTEN Suitelauf in dieser App
```

**Ein fehlender Ordner ist sichtbar. Neunundneunzig fehlende Tests sind es
nicht.** Wer in einem Wegwerf-Baum eine App anfasst, die er dort noch nicht
angefasst hat, sieht einmal nach — nicht nach dem Lauf, sondern davor.

## Und die bequeme Hälfte

Beim ersten Auftreten wurde belegt, dass die roten Zeilen **nicht von der
eigenen Änderung stammen** — durch Vergleich der roten Dateien vorher und
nachher. Das war richtig und ist die Methode aus
[[feedback-numstat-lies-in-stale-worktree]].

**Aber es beantwortet nur die halbe Frage.** „Nicht meine" heißt nicht „kein
Problem". Wer eine rote Zeile als fremd belegt und weitergeht, hat bewiesen,
dass er unschuldig ist — nicht, dass die Suite gemessen hat, was sie zu messen
vorgibt. Siehe [[feedback-fix-suite-failures]] und
[[feedback-a-check-that-cannot-fail]].

**How to apply:**
- Vor dem ersten Suitelauf in einer App, die dieser Baum noch nicht kennt:
  `ls apps/<app>/node_modules/`.
- Eine rote Zeile mit `Cannot find module` ist **nie** ein Testbefund. Sie ist
  ein Befund über den Schreibtisch.
- Und die Testzahl lesen, nicht nur die Fehlerzahl: Ein Lauf, der plötzlich
  hundert Tests weniger zählt, hat nicht bestanden — er hat weniger geprüft.

## Und es trifft `tsc` genauso, nicht nur die Tests

07.09.2026, gemessen von 3 Agent nach dem Setzen des fehlenden Verweises:

| | vorher | nachher |
|---|---|---|
| `tsc --noEmit` in `apps/pixel-peloton` | **36 Fehler** | **0** |

Alle sechsunddreißig waren Phantome desselben fehlenden Verweises — und das
ist die eigentliche Lehre: **Die Zahl war an diesem Tag mehrfach als
Vergleichsmaßstab benutzt worden** („36 Bestandsfehler, davon sind 4 neu"). Ein
Maßstab, der vom Schreibtisch kommt statt vom Code, macht jede Differenz, die
man an ihm misst, wertlos.

Das ist gefährlicher als eine rote Testzeile, weil es sich umgekehrt anfühlt:
Rot sieht nach einem Befund aus, den man erklärt. Eine Bestandszahl sieht nach
Hintergrund aus, den man nicht mehr hinterfragt.

**How to apply:**
- Eine „Bestandszahl" an Fehlern ist erst ein Maßstab, wenn sie auf
  `origin/main` in einem frischen Baum mit gesetzten Verweisen entstanden ist.
- Und wenn die Zahl beim Setzen eines Verweises auf null fällt, gehört das
  gemeldet — jeder, der sie zitiert hat, rechnet sonst weiter mit ihr.
