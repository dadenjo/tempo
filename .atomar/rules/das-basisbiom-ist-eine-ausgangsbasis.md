---
name: das-basisbiom-ist-eine-ausgangsbasis
title: Im Editor gewinnt der Mensch — das Basis-Biom ist eine Ausgangsbasis, keine Grenze
origin: operator
rank: 25
version: 1.0.0
short: "Wer im Story-Editor etwas einstellt, will es sehen. Voreinstellungen, Stimmigkeitsregeln und Vorgabemengen duerfen den Ausgangspunkt liefern, aber nie die Auswahl beschneiden."
---
## Der Satz

der Betreiber, 09.09.2026, nach einer Nacht mit drei Fehlern derselben Familie:

> *„Ich will hier komplett frei arbeiten. Das Biom ist quasi nur eine
> Ausgangsbasis — ich will aber alles verändern können."*

Und eine Stunde vorher, kürzer:

> *„Ja, ich will das sehen, was ich einstelle."*

## Woran es sich entzuendet hat

Drei Befunde in einer Nacht, alle mit derselben Wurzel: **etwas Kluges hat
eine Entscheidung des Menschen ueberstimmt, ohne es zu sagen.**

| Befund | was ueberstimmte |
|---|---|
| hinzugefuegte Objekte erschienen nie | `defaultAmount` gibt fuer jede Art, die das Design nicht backt, **0** |
| dreizehn Arten wurden 36 Palmen | die Platzhalter-Regel `* -> palm` auf `coast:L` |
| „immer nur das, was im Basis-Biom ist" | beides zusammen, aus der Betreibers Sicht |

Keiner dieser Mechanismen war falsch gebaut. **Jeder war fuer eine
KI-erzeugte Welt gedacht** — dort ist eine Vorgabemenge sinnvoll und eine
Stimmigkeitskorrektur erwuenscht. Am Regler eines Menschen sind sie das
Gegenteil.

## Die Regel

- **Der Editor ist kein Vorschlagswesen.** Was dort eingestellt wird, ist
  eine Entscheidung, keine Vermutung, die korrigiert werden muesste.
- **Voreinstellungen ja, Grenzen nein.** Das Design liefert den Ausgangspunkt
  — welche Objekte, welche Farben, welches Wetter. Danach ist jede davon
  frei aenderbar, auch in Werte, die das Design nie haette.
- **Eine Null aus einer Vorgabe ist kein Wunsch.** Wenn `defaultAmount` fuer
  eine fremde Art 0 liefert, heisst das „das Design hat davon keine", nicht
  „der Mensch will keine". Beim Hinzufuegen kann nur das Erste gemeint sein.
- **Stimmigkeitsregeln gelten dem Erzeugten, nicht dem Gewaehlten.** Wo eine
  eigene Auswahl vorliegt, treten sie zurueck (D-061).

## Was das kostet, und warum es trotzdem gilt

KI-Welt und Handarbeit laufen durch denselben Weg (`opts.pool`), und das war
am 25.08. ausdruecklich so entschieden. **Was hier fuer den Menschen
abgeschaltet wird, ist damit auch fuer die KI abgeschaltet.** Sehen
KI-Kuestenwelten dadurch schlichter aus, ist das der Preis dieser Regel und
kein neuer Fehler.

**How to apply:**
- Bei jeder Frage der Form „darf die Automatik hier korrigieren": im Editor
  **nein**. Ausserhalb: nach Sachlage.
- Und bei einer Zahl, die aus einer Vorgabe stammt, immer fragen, **ob sie
  eine Aussage ueber die Welt oder ueber den Wunsch ist**. Diese beiden
  Bedeutungen in einem Wert sind die Fehlerform dieser Nacht — dreimal in
  vier Stunden, als `undefined`, als `0`, und als fehlender Umfang.
