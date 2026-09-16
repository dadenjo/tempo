---
name: die-landkarte-wandert-mit
title: "Die Landkarte wandert mit — wer eine Wahrheitsquelle bewegt, zieht die Karte im selben PR nach"
origin: operator
rank: 105
version: 1.1.0
short: "Die Landkarte der Wahrheitsquellen (.atomar/landkarte) ist ein Verweis-Index, den Agenten VOR dem Messen lesen. Ein Verweis, der ins Leere zeigt, schickt den Leser genau dorthin, wo nichts ist — darum wandert die Karte im selben PR wie die Quelle, und ein Waechter haelt sie lebendig."
---
## Der Fall

16.09.2026. 3 Agent brauchte 25 Minuten, um zu finden, wo die Kamera
haengt — nicht in einer Lib, sondern im Frame-Block der Szene. 0 Agent
wusste bei den Absperrbaendern nicht, dass das Kamerafenster Bogenlaenge
abrollt und nicht Weltraum. Beides stand nirgends, wo eine neue Sitzung es
gefunden haette: im HUB-Kontext (fluechtig), in Gedaechtnisdateien (nur der
HUB), verstreut in Eintraegen. der Betreiber: „ja anlegen!"

## Die Regel

1. **Je Bereich eine Karte** unter `.atomar/landkarte/<bereich>.md`, im
   strengen Format der LIESMICH: Wahrheitsquellen, Regler, Benches,
   Waechter, Szenen und Seiten, Entscheidungen, Bekannte Grenzen — als
   Tabellen aus Verweisen. Keine Erklaerungen: ein Satz je Zeile, der sagt,
   WAS dort steht, nicht WARUM.
2. **Die Karte wandert mit.** Wer eine Wahrheitsquelle anlegt, verschiebt,
   umbenennt oder abloest, aendert die Karte im selben PR. Ein PR, der eine
   Quelle bewegt und die Karte nicht, ist unvollstaendig — auch wenn alle
   Tests gruen sind.
3. **Die Karte ist kein Handbuch.** Wer auf der Karte eine Erklaerung
   schreiben will, schreibt sie in die Datei, auf die die Karte zeigt, und
   laesst auf der Karte den Verweis.
4. **Gelesen wird sie beim Start.** Der Startprompt nennt die Karten; der
   Verteiler liest sie nach einem Compact statt seines Gedaechtnisses; wer
   in einem Bereich messen will, liest zuerst dessen Karte.
5. **Der Waechter haelt sie lebendig.** `.atomar/wachtposten/pruefe-landkarte.mjs`
   verlangt, dass jeder Pfad existiert, jede Bench-Route eine Seite hat und
   im Admin-Menue steht, jeder Regler-Schluessel im Code vorkommt und jede
   D-/T-ID im Backlog liegt. Er laeuft im Gate und in der Suite. Rot heisst:
   die Karte nachziehen — nie den Verweis loeschen, ohne die neue Stelle zu
   nennen.
6. **Abgestimmt, nicht geraten.** Wer eine Karte fuer einen fremden Bereich
   anlegt, holt die Zeilen bei der Sitzung, die den Bereich kennt, und traegt
   sie im Kopf als `abgestimmt` ein. Bis dahin steht dort `ausstehend`.

## Die Karte ist der Wissensblock der Bahn (T-471, D-111 Baustein 3)

Wer einen Eintrag in einem Bereich mit Karte anlegt, trägt die Karte in `karten:`
ein (`task … --karten merge-weg`). Der Startprompt hängt dann `## Bekannte
Grenzen` und `## Entscheidungen` dieser Karten an — „Was in deiner Bahn gilt" —,
bevor die Sitzung misst. Eine Sitzung, die die Grenzen nicht bekommt, misst mit
dem Gedächtnis. Die Wache prüft die Gegenrichtung: ein Name in `karten`, den es
nicht gibt, ist rot; eine Karte ohne Grenzen, die ein aktiver Eintrag verlangt,
ebenso. Das ist der Wissensblock aus maternity-copilot (`knowledgeBlock.ts`:
„the ONLY place domain intelligence lives") ohne Router — die Bahn steht im
Eintrag, nicht in einem Tag-Abgleich.

## Was die Regel nicht ist

Kein zweites Backlog und keine zweite Regelliste. Entscheidungen stehen im
Backlog, Verhalten in den Regeln — die Karte zeigt nur, WO etwas gilt.
