---
name: ein-exit-code-hinter-einer-pipe
title: Ein Exit-Code hinter einer Pipe gehört nicht dem Programm, das man geprüft hat
origin: operator
rank: 330
version: 1.0.0
short: "`prog | head` meldet den Erfolg von `head`. Wer so misst, liest den Exit-Code eines Programms, das nie scheitern konnte — und nennt eine Ablehnung ein Bestehen."
---
## Der Fall

6 Agent, 07.09.2026, **zweimal an einem Tag**.

Beim ersten Mal ein Typecheck:

```bash
npx tsc --noEmit 2>&1 | tail -15
echo "=== Exit: $?"        # meldet 0
```

`tsc` hatte acht Fehler gefunden und mit **2** geendet. Die `0` war die von
`tail`, das seine fünfzehn Zeilen tadellos ausgegeben hatte. Die Fehler
standen sogar auf dem Schirm — nur stand darunter „Exit: 0", und die Zeile
las sich wie ein Freispruch.

Beim zweiten Mal ein Wachtposten, der ohne Zugangsdaten abbrechen soll:

```bash
node .atomar/wachtposten/pruefe-kappung.mjs 2>&1 | head -3
echo "  Exit: $?"          # meldet 0
```

Der Posten hatte korrekt mit **2** geendet. Notiert wurde „Exit: 0" — und
damit stand fast im Eintrag, die Gegenprobe sei durchgefallen, wo sie
bestanden hatte.

## Warum es zweimal passiert ist

Weil es sich richtig anfühlt. Man will die Ausgabe kürzen, weil sie lang ist,
und hängt `head` oder `tail` an. Die Absicht ist das Lesen, nicht das Messen
— aber `$?` misst trotzdem, und zwar das Letzte in der Kette.

**Das Tückische ist die Richtung des Fehlers.** `head` und `tail` scheitern
praktisch nie. Der falsche Exit-Code ist deshalb fast immer eine **0** — er
zeigt in Richtung „bestanden", niemals in Richtung „kaputt". Ein Fehler, der
nur in eine Richtung zeigt, wird nicht bemerkt: Er widerspricht nie dem, was
man ohnehin hofft.

## Was stattdessen

**In eine Datei schreiben und danach lesen.** Dann gehört `$?` dem Programm:

```bash
npx tsc --noEmit > /tmp/lauf.txt 2>&1; echo "Exit: $?"
head -15 /tmp/lauf.txt
```

Wo eine Pipe sein muss, misst `${PIPESTATUS[0]}` (bash) oder
`${pipestatus[1]}` (zsh) das erste Glied — aber die Datei ist der Weg, den
man auch um Mitternacht noch richtig tippt.

## Dieselbe Familie

Verwandt mit [[gruener-exit-code-ueber-einer-absage]]: Dort gibt ein Skript
selbst eine 0 aus, obwohl es abgelehnt hat. Hier gibt ein **fremdes**
Programm die 0. In beiden Fällen steht ein Erfolgszeichen über einem Vorgang,
der nicht erfolgreich war — und in beiden Fällen ist die Abhilfe dieselbe:
**nicht die Zusammenfassung lesen, sondern den Ausgang dessen, was man
wirklich geprüft hat.**

Und es ist derselbe Fehler wie eine Gegenprobe, deren Mutation nicht greift
(am selben Tag, im selben Vorgang): Die Prüfung lief, sie konnte nur nicht
scheitern. **Eine Messung, die nicht fehlschlagen kann, misst nicht.**
