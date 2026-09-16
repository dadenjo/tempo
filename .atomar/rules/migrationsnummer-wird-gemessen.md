---
name: migrationsnummer-wird-gemessen
title: Eine Migrationsnummer wird gemessen, nicht fortgezählt
origin: operator
rank: 310
version: 1.0.0
short: "Bei mehreren Sitzungen, die parallel schreiben, ist „die nächste nach meiner letzten\" fast immer falsch — und der Schaden ist still, weil in Namensreihenfolge die ältere die neuere überschreibt."
---
## Der Fall

In der Nacht zum 05.09.2026 entstanden **zwei Dateien mit der Nummer
0074**. Beide ersetzten dieselbe Datenbankfunktion. In Namensreihenfolge
läuft `0074_minuten…` vor `0074_pp_trial…` — ein frisch aufgesetzter
Stand hätte also zuerst die neue Fassung bekommen und danach die alte
darüber.

Ergebnis: eine Datenbank, in der ein Fix von heute nicht existiert. **Und
nichts wird dabei rot.**

Am selben Tag traf eine `0076` auf eine fremde `0076`. Diesmal wurde die
höchste vorhandene Nummer **gemessen** statt geraten — daraus wurde 0077,
und der Fehler wiederholte sich nicht.

## Die Regel

Vor jeder neuen Migration die höchste vorhandene Nummer **auf
`origin/main`** ermitteln, nicht im eigenen Baum und nicht aus dem
Gedächtnis. Der eigene Baum kennt die Migrationen der anderen Sitzungen
nicht.

## Warum es leicht zu übersehen ist

Der Schaden tritt nicht beim Schreiben auf und nicht beim Testen. Er
tritt auf, wenn jemand die Migrationen **der Reihe nach** anwendet — also
Wochen später, bei einem neuen Aufsetzen, wenn niemand mehr an den Tag
denkt.
