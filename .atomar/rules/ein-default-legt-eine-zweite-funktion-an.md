---
name: ein-default-legt-eine-zweite-funktion-an
title: Ein DEFAULT an einer Postgres-Funktion ersetzt sie nicht — er legt eine zweite daneben
origin: operator
rank: 40
version: 1.0.0
short: "`create or replace function f(a, b, c default false)` ersetzt `f(a, b)` NICHT. Postgres unterscheidet Funktionen an der Argumentliste; es entstehen zwei, und ein Aufruf mit zwei Argumenten passt auf beide. Der Fehler kommt nicht bei der Migration, sondern zur LAUFZEIT."
---
## Der Fall

07.09.2026, T-138. Ein neuer Parameter sollte an eine bestehende Zählfunktion,
additiv — so, wie die Staging-Schranke es verlangt (Staging teilt die
Produktionsdatenbank, Produktionscode läuft weiter dagegen). Der naheliegende
Weg:

    create or replace function stimme_zaehlen(p_frage text, p_richtung text,
                                              p_intern boolean default false)

Das sieht aus wie eine Ersetzung mit Rückwärtsverträglichkeit. Es ist keine.
**Postgres identifiziert eine Funktion über ihre Argumentliste**, nicht über
ihren Namen. `stimme_zaehlen(text, text)` und `stimme_zaehlen(text, text,
boolean)` sind zwei verschiedene Funktionen — die alte bleibt stehen, die neue
kommt dazu.

Und dann passt ein Aufruf mit zwei Argumenten auf **beide**:

    ERROR:  function stimme_zaehlen(text, text) is not unique

## Warum das schlimmer ist als ein Migrationsfehler

Die Migration läuft **grün durch**. Sie hat ja nichts Falsches getan — sie hat
eine Funktion angelegt. Der Widerspruch entsteht erst, wenn jemand die alte
Signatur aufruft, und das ist die laufende Produktionsfassung während des
Deploys: eine öffentliche Route ohne Anmeldung, mitten im Spiel.

Ein Fehler, der bei `apply_migration` erscheint, kostet zwei Minuten. Derselbe
Fehler, der zur Laufzeit erscheint, kostet einen Zwischenfall.

## Die Regel

**Drei Pflichtargumente statt zwei plus Vorgabe.** Eindeutig, kein zweiter
Kandidat, kein Aufruf, der auf beide passt.

Die alte Funktion bleibt dabei ausdrücklich unangetastet — das ist kein
Versäumnis, sondern genau die Additivität, die die Staging-Schranke fordert:
Während des Deploys zählt die alte Fassung weiter, und niemand verliert eine
Stimme. Sie geht in einem ZWEITEN Schritt, nach dem Promote.

**How to apply:**
- Einen Parameter an eine bestehende Funktion hängen: **ohne `default`**, und
  alle Aufrufer im selben Schritt mitziehen.
- Vor dem Anwenden nachsehen, was schon da ist:
  `select oid::regprocedure from pg_proc where proname = '<name>';`
  Steht dort nach der Migration mehr als eine Zeile, ist es passiert.
- Und die alte Fassung erst löschen, wenn die neue nachweislich läuft — siehe
  [[erst-fertig-dann-live]] und die Staging-Schranke in CLAUDE.md.
