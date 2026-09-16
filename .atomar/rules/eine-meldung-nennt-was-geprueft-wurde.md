---
name: eine-meldung-nennt-was-geprueft-wurde
title: Eine Fehlermeldung nennt, was GEPRÜFT wurde — nicht nur, was gebraucht wird
origin: operator
rank: 38
version: 1.0.0
short: "„Trial-Zusage aus landing_fakten fehlt\" nennt das Ziel und verschweigt den Weg. Wenn der Fehler auf dem Weg liegt, schickt die Meldung den Betreiber genau dorthin, wo alles in Ordnung ist — und er sucht dort weiter."
---
## Der Fall, und er ist der zweite seiner Art im selben Merkmal

Der Mailversand im Hub meldete am 07.09.2026:

> Unvollständig: Trial-Zusage aus `landing_fakten` — es wird nichts gesendet,
> solange das fehlt.

**Die Zusage stand die ganze Zeit in `landing_fakten`**, aktiv, in beiden
Sprachen. Die Ursache lag im Code: Der Ladeweg gab die Zusage nur für Vorlagen
mit `art: "code"` zurück, und diese Art gibt es seit zwei Tickets an keiner
Vorlage mehr. Die Schranke traf also bei **jedem** Aufruf, unabhängig vom
Inhalt der Datenbank.

Das Bemerkenswerte ist nicht der Fehler, sondern seine Wiederholung. Der Kopf
von `landingFakten.ts` beschreibt denselben Ausgang vom 03.09.2026 wörtlich:

> „Der Betreiber schaut in die Fakten, findet die Zeile dort einwandfrei, und
> sucht an der falschen Stelle weiter."

Andere Ursache, dieselbe Meldung, derselbe Irrweg — vier Tage später.

## Warum eine falsche Fährte teurer ist als gar keine

Ohne Meldung sucht man überall. Mit dieser Meldung sucht man **an genau einer
Stelle, und zwar an der falschen** — und weil dort alles stimmt, zweifelt man
an sich statt an der Meldung. Sie hat die Suche nicht verkürzt, sie hat sie
umgeleitet.

## Die Regel

Eine Meldung über etwas Fehlendes trägt drei Dinge, und keines ist teuer:

1. **Was gesucht wurde** — die Bedingung, konkret: `seite=…`, `schluessel=…`,
   `sprache=…`.
2. **Was gefunden wurde** — die ZAHL. „0 von 0 Zeilen geholt" und „2 Zeilen
   geholt, keine passte" sind zwei völlig verschiedene Lagen, und die Meldung
   muss sie unterscheiden können.
3. **Wohin man geht** — der Weg, an dem man es ändert.

Fehlt Punkt 2, ist die Meldung eine Vermutung über den Ort des Fehlers,
formuliert als Tatsache.

**How to apply:**
- Vor jeder `if (!x) return { fehlt: "…" }`-Zeile fragen: Kann `x` auch dann
  leer sein, wenn die Daten stimmen? Wenn ja, gehört das in den Text.
- Eine Bedingung, die seit einem Umbau nicht mehr wahr werden kann, ist keine
  Prüfung mehr, sondern eine Absage. Siehe
  [[eine-anwesenheitspruefung-findet-keine-luecke]] und
  [[die-gegenprobe]].
