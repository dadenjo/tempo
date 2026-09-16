---
name: eine-widerlegung-ist-auch-eine-messung
title: Eine Widerlegung ist auch eine Messung — und wird geprüft wie jede andere
origin: operator
rank: 32
version: 1.0.0
short: "Am 06.09. hat eine Sitzung die richtige Ursache als Erste genannt und sie auf eine Widerlegung hin fallen lassen, die niemand nachgerechnet hat. Die Suche lief danach noch zwei Stunden. Wir prüfen jede Bestätigung gegen — und keine einzige Widerlegung."
---
## Der Fall

06.09.2026, das Dashboard zeigte bei zwei von drei Kunden „NOCH KEINE FAHRT",
obwohl sie gefahren waren.

**6 Agents erste Hypothese war die richtige:** Die Ereignisabfrage liest mit
`order at ASCENDING` und einem Höchstmaß — bei Überlauf kommen die
**ältesten** Zeilen an, die neuen fehlen. Sie nannte die Zahl, die es
entscheidet, statt sie zu behaupten.

**1 HUB hat sie widerlegt:**

> „`pp_report_events` hat 1256 Zeilen. Das Höchstmaß im Code ist 20 000. Die
> Grenze greift nicht."

**Die Zahl war richtig. Der Schluss war falsch.** Geprüft wurde die Grenze im
Code — die des Servers kannte niemand: PostgREST hat ein eigenes
`db-max-rows`, üblicherweise **1000**, und es schlägt jede Angabe im Code.

**1256 > 1000 stand die ganze Zeit da.**

Danach lief die Suche zwei Stunden weiter: Zeitfenster, Kategorie-Filter,
`user_id`, zweites Konto, E-Mail-Verknüpfung, Anmeldedatum — neun Ausschlüsse,
alle sauber gemessen, alle am falschen Gegenstand.

**Gemessen wurde es am Ende in einer Zeile:** `fetch('/api/admin/dashboard')`
gab **exakt 1000** Ereignisse zurück, das letzte vom 04.09. 21:05.

## Die Asymmetrie, um die es geht

| | wird bei uns |
|---|---|
| eine **Bestätigung** | gegengeprüft — „hätte der Test rot werden können?" |
| eine **Widerlegung** | geglaubt |

**Eine Widerlegung beendet eine Suche.** Sie ist damit teurer als eine
Bestätigung, nicht billiger — und trotzdem prüft sie niemand.

6 Agents eigene Fassung:

> **„Es war meine Hypothese, und ich habe sie auf ein Argument hin aufgegeben,
> das ich nicht nachgerechnet habe."**

## Die Regel

- **Wer eine Hypothese aufgibt, prüft die Widerlegung so, wie er eine
  Bestätigung prüfen würde.** Dieselbe Frage: *Könnte diese Messung die falsche
  Sache messen?*
- **Und wer widerlegt, nennt die Grenze seiner Widerlegung mit.** „1256 < 20 000"
  war eine Aussage über EINE Grenze — dass es eine zweite geben könnte, gehörte
  in denselben Satz.
- **Eine Zahl, die genau auf einem Höchstmaß sitzt, ist ein Verdacht und kein
  Ergebnis.** 1000 von 1000 heißt nie „das sind alle".

Verwandt: [[die-gegenprobe]], [[richtig-gezaehlt-ueber-die-falsche-menge]],
[[zwischen-befund-und-auge-sitzt-etwas]].
