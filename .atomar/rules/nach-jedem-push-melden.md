---
name: nach-jedem-push-melden
title: Nach jedem Push wird gemeldet
origin: operator
rank: 300
version: 1.1.0
short: "Der Push ist ein Ereignis, „fertig\" ist ein Gefühl. Gemeldet wird der Stand: Commit, Testzahl, Exit-Code — und was offen blieb."
---
## Warum

„Ich bin fast durch" lässt sich nicht planen. Ein Commit-Hash lässt
sich nachlesen.

## Wie

Stand, Zahlen mit Quelle, offene Frage, und die Frage nach dem
nächsten Auftrag.

## Die Abschlussmeldung ist ein Vertrag (T-473, D-111 Baustein 5)

Aus maternity-copilot `lib/agentic/outputContract.ts`: „No free-text-only
responses are accepted." In Dateiform bleibt die Meldung Prosa — der Betreiber
liest sie —, aber die letzte Log-Zeile des Eigentümers vor `umgesetzt`/`done`
trägt sieben Marken, und `set` lehnt das Schließen sonst ab, mit der Liste
dessen, was fehlt:

| Marke | steht für |
|---|---|
| `PR #n` oder `Commit <sha>` | was sich geändert hat |
| `n Dateien` | der Umfang (nur bei PR) |
| `tsc n` oder `Suite pass/fail` | die Prüfung, mit Zahl |
| `Gegenprobe …` | der Beleg, dass die Prüfung scheitern kann |
| `PLAN x / IST y` | die Abweichung von der Schätzung |
| `offen: …` | was liegen blieb (`nichts` gilt) |
| `UNGEPRÜFT: …` | was nicht gemessen wurde (`nichts` gilt) |

Keine Zahl über die eigene Sicherheit (`confidence` des Motors): eine Zahl,
die eine Sitzung über sich selbst tippt, ist keine Messung — die
UNGEPRÜFT-Liste ist ihr ehrliches Gegenstück. Wer einen fremden Eintrag
schließt, holt die Zeile beim Eigentümer; `pruefe-abschluss.mjs` misst den
Bestand ab `stichtag_abschluss`. Gemessen 16.09.: 416 erledigte Aufgaben,
`PLAN/IST` in 13.
