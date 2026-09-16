---
name: erst-pruefen-dann-beauftragen
title: Erst pruefen, dann beauftragen — und pruefen lassen ist erlaubt
origin: operator
rank: 38
version: 1.0.0
short: "Ein Auftrag beschreibt Arbeit, die noch zu tun ist. Wer ihn schreibt, ohne nachzusehen, was schon da ist, beauftragt manchmal Fertiges — und der Beauftragte glaubt es ihm. Der Verteiler muss das nicht allein pruefen: „Sieh zuerst nach, was es gibt\" ist ein vollstaendiger Auftrag."
---
## Warum

der Betreiber, 05.09.2026: *„Da waere doch was fuer unsere Regeln: erst pruefen, dann
Auftrag erteilen — bzw. pruefen lassen, du bist nicht allein."*

Zweimal an einem Abend hat der Verteiler Arbeit beauftragt, die es schon gab:

**T-010.** Ich schrieb um 16:54 selbst **„GELOEST"** in den Eintrag. Um 21:04
setzte ich vier Zeilen darunter einen Durchgang, der ihn als offen behandelt,
den Eigentuemer wechselt und zwei Loesungswege vorschlaegt. Verhindert hat es
nur die Abstimmungsauflage, die ich in denselben Auftrag geschrieben hatte —
sonst haette 0 Agent eine Loesung gebaut, die seit fuenf Stunden **live** war.

**T-091.** Ich beauftragte einen Pruefstand fuer die Sammelkarte. Es gab ihn
seit dem **30.08.**, verlinkt im Admin-Panel, 259 Zeilen, mit genau der
Zeichenfunktion und genau dem Datensatz, an dem der Verstoss gemessen worden
war. Gefunden hat es 2 Agent, **bevor** sie anfing.

## Warum es der Verteiler haeufiger falsch macht als die Bauenden

Er schreibt Auftraege aus **Gespraechen**, nicht aus dem Code. Was der Betreiber
gerade gesagt hat, klingt neu — und ob es neu IST, steht nicht im Satz, sondern
im Bestand. Und weil ein Auftrag von oben kommt, prueft der Beauftragte ihn
seltener: **„Bau X" liest sich wie „X gibt es nicht."**

## Die Regel

**Vor jedem Auftrag: nachsehen, was es schon gibt.** Den Eintrag selbst lesen —
ganz, nicht die letzten Zeilen. Nach dem Namen der Sache suchen. Wenn eine
Oberflaeche gemeint ist: nachsehen, ob es sie gibt.

**Und pruefen lassen ist erlaubt und oft besser.** Der Verteiler muss es nicht
allein tun; er darf es zum ersten Schritt des Auftrags machen:

> „Sieh zuerst nach, ob es das schon gibt. Wenn ja, melde was — und bau nicht."

Das ist ein **vollstaendiger** Auftrag, kein halber. Es kostet dem Beauftragten
zehn Minuten und spart im Zweifel zwei Stunden — und er ist naeher am Code als
der Verteiler.

**Was NICHT geht: den Auftrag schreiben und hoffen, dass jemand es merkt.**
Beide Male hat es jemand gemerkt, und beide Male war es Glueck in Form einer
sorgfaeltigen Sitzung.

## Der Zusatz, der im Auftrag stehen muss

Wer den Auftrag schreibt, sagt dazu, **was er selbst geprueft hat und was
nicht**. Dann weiss der Beauftragte, wo er anfangen muss:

- „Ich habe nachgesehen, es gibt nichts" → er baut.
- „Ich habe nicht nachgesehen" → er sieht zuerst nach.
- Nichts davon → er glaubt, es sei geprueft.

## Verwandt

[[erst-suchen-dann-bauen]] — dieselbe Regel eine Ebene tiefer, fuer den
Bauenden. Dass sie dort steht und hier gefehlt hat, ist der Grund, warum es
beide Male der Verteiler war.

## Es gilt auch fuer FRAGEN, nicht nur fuer Auftraege

Eine Stunde nach dem Aufschreiben dieser Regel hat der Verteiler sie wieder
gebrochen — diesmal mit einer Entscheidung statt eines Auftrags.

**D-036** stellte die Frage, wie ein bestimmter Kunde in einer Mail angeredet
wird. **D-010 hatte sie am 04.09. beantwortet** — mit Antwort C, und die
Entscheidung nennt **denselben Empfaenger mit demselben Namen woertlich**:
*„‚Hallo thomas.junk,' geht so raus."*

Erkannt hat es der Betreiber, nicht der Verteiler: *„Darueber haben wir schon mal
diskutiert."*

Also: **Bevor eine Frage gestellt wird, wird nachgesehen, ob sie schon
beantwortet ist.** Eine zweimal gestellte Frage ist teurer als eine zu spaet
gestellte — sie kostet den Menschen Zeit fuer etwas, das er schon entschieden
hat, und sie laesst ihn zweifeln, ob seine erste Antwort angekommen ist.

## Was alle drei Faelle eines Abends gemeinsam haben

T-010 (Auftrag fuer etwas Geloestes), T-091 (Auftrag fuer etwas Vorhandenes),
D-036 (Frage nach etwas Entschiedenem):

**Alle drei entstanden aus dem GESPRAECH, nicht aus dem Bestand.** Ein Befund
aus einer Nachricht klingt neu — und ob er neu IST, steht nicht in der
Nachricht. Der Verteiler ist die Stelle, an der Gespraech und Bestand
aufeinandertreffen; dreimal an einem Abend hat er das Gespraech genommen.

## Der Verteiler beauftragt, was er selbst gerade fertiggestellt hat

05.09.2026, spaeter Abend. Der Verteiler haengte **T-052** und **T-090** an eine
freie Sitzung. Beide waren **bereits gemergt** — in PRs, die **er selbst
Minuten zuvor zusammengefuehrt hatte**. 5 Agent hat vor dem ersten Handgriff
gemessen und beide auf `done` gesetzt, ohne eine Zeile Code anzufassen.

Damit ist es an einem Abend **viermal** dieselbe Sache: eine geloeste Aufgabe,
ein vorhandener Pruefstand, eine getroffene Entscheidung — und jetzt zweimal
eigene, gerade erst gemergte Arbeit.

### Die Ursache ist diesmal keine Nachlaessigkeit, sondern eine Luecke

**Ein Merge aendert den Eintrag nicht.** Er ist eine Handlung in git; der
Eintrag ist eine Datei daneben. Wer zusammenfuehrt, weiss in dem Moment, was
fertig ist — und der Eintrag erfaehrt es nur, wenn jemand es hineinschreibt.

Solange das so ist, **erzeugt jeder Merge einen Eintrag, der luegt**, und der
Verteiler liest kurz darauf seine eigene Liste und findet dort Arbeit, die es
nicht mehr gibt.

### Die Regel

- **Wer einen PR zusammenfuehrt, zieht im selben Zug die Eintraege nach.** Nicht
  „spaeter beim Durchgang" — dazwischen liegt die Zeit, in der jemand
  beauftragt wird.
- Und solange das von Hand geschieht: **vor jeder Zuweisung die zuletzt
  gemergten PRs ansehen.** Es sind die wahrscheinlichsten Kandidaten fuer
  „steht offen und ist fertig".

### Was daran gut ging

Beide Male hat die beauftragte Sitzung **gemessen statt gebaut** — und in der
Meldung stand, woran: PR-Nummer, Merge-Zeit, Gegenprobe im frischen Baum,
Testzahl. **Zwei Auftraege, null Zeilen Code, zwei richtige Eintraege.** Die
Regel wirkt also, auch wenn der Verteiler sie bricht; sie faengt ihn beim
Zweiten statt beim Ersten.
