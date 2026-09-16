---
name: eine-anwesenheitspruefung-findet-keine-luecke
title: Eine Prüfung auf Anwesenheit kann eine Auslassung nicht finden
origin: operator
rank: 90
version: 1.0.0
short: "Wer prüft, ob die Bestandteile da sind, misst nie, was fehlt. Bei einem Umzug ist der Maßstab die scharfe Gleichheit des GANZEN Ergebnisses gegen die Fassung, die schon draußen war."
---
## Der Fall

3 Agent, 07.09.2026, T-119. Die Willkommensmail zog aus dem Code in die
Datenbank. Der Wächter für den Umzug tat das Naheliegende: Er nahm jeden
Satz, den die alte Fassung schreibt, und prüfte, ob er in der neuen steht.

Er war grün. **Drei Dinge fehlten trotzdem:**

1. der Fußsatz („Diese Nachricht kommt einmal") — der neue Bauer ließ ihn weg
2. die Anrede — aus „Hallo Thomas," wurde der feste Titel „Hallo,"
3. die zweite Hälfte des Linklabels — aus „Go to your account · Zu deinem
   Konto" wurde „Go to your account"

Die ersten beiden fielen auf, weil sie ganze Sätze sind und die Satzliste
sie enthielt. **Nummer 3 fiel nicht auf, und konnte es nicht:** Die
Prüfung suchte den Link, der Link war da. Dass ihm ein Wort fehlte, war
keine Frage, die sie stellt.

Ein Wächter, der zwei von drei Fehlern findet, sieht aus wie ein guter
Wächter. Er ist der gefährlichste — er belegt die Sorgfalt, die er nicht
geleistet hat.

## Warum eine Anwesenheitsprüfung das nicht kann

Sie fragt: *Ist X da?* Damit kann sie über nichts urteilen, das sie nicht
schon kennt. Alles, woran beim Aufschreiben der Liste niemand gedacht hat,
ist für sie **nicht abwesend, sondern nicht vorhanden** — und das ist kein
Befund, sondern eine Leerstelle.

Das ist dieselbe Krankheit wie bei einer Formprüfung, die keinen Inhalt
findet: **Die Prüfung ist nicht kaputt, sie stellt die falsche Frage.**
Deshalb hilft es auch nicht, sie zu verschärfen. Eine längere Satzliste
findet die vierte Auslassung genauso wenig.

## Die Regel

**Wo etwas UMZIEHT — ein Text, ein Datensatz, eine Berechnung, ein ganzer
Bauweg —, ist der Maßstab die scharfe Gleichheit des GANZEN Ergebnisses,
nicht die Anwesenheit seiner Bestandteile.**

```js
// findet, was fehlt:
assert.equal(neu.text, alt.text);

// findet nur, was jemand vorher aufgeschrieben hat:
for (const satz of SAETZE) assert.ok(neu.text.includes(satz));
```

Verglichen wird gegen die Fassung, die **schon draußen war** — bei einer
Mail die, die zugestellt wurde; bei einer Berechnung die, deren Zahlen in
einem Bericht stehen. Nicht gegen eine zweite Beschreibung dessen, was
herauskommen soll: Die kann denselben blinden Fleck haben wie der Umbau.

Passt die scharfe Gleichheit nicht, weil sich etwas absichtlich ändert,
dann **ist genau diese eine Abweichung der Gegenstand** — sie wird
benannt, begründet und gemeldet, nicht durch eine weichere Prüfung
ersetzt. Eine Prüfung aufzuweichen, damit sie durchgeht, ist der Moment,
in dem sie aufhört, eine zu sein.

## Und was sie NICHT ersetzt

Die scharfe Gleichheit sagt „gleich" oder „ungleich" — sie sagt nicht, ob
das Ergebnis richtig IST. Der alte Weg kann denselben Fehler getragen
haben. Sie sichert einen UMZUG ab, keinen Neubau; wo etwas zum ersten Mal
entsteht, bleibt die Prüfung am Ergebnis (`messen-statt-vermuten`,
`die-gegenprobe`).

## Verwandt
- `pruefe-auf-die-faehigkeit-nicht-auf-die-ausnahmen` — auch dort stellt die
  Prüfung die falsche Frage, nur in der anderen Richtung: Sie zählt die
  bekannten Sonderfälle auf, statt die Fähigkeit zu prüfen.
- `wo-etwas-fehlt-steht-dass-es-fehlt` — die Lücke wird benannt, nicht
  gefüllt. Hier ist sie nicht einmal benannt worden, weil niemand nach ihr
  gefragt hat.
- `die-gegenprobe` — jede Messung braucht eine, die scheitern KANN. Eine
  Anwesenheitsprüfung kann an einer Auslassung nicht scheitern.
- `waechter-die-nichts-bewachen`
