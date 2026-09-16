---
name: erst-fertig-dann-live
title: Erst fertig, dann live — nicht jeder Fix geht auf Produktion
origin: operator
rank: 42
version: 1.0.0
short: "Ein Deploy ist kein Speicherknopf. Was lokal pruefbar ist, wird lokal geprueft und fertiggebaut; auf Produktion geht es, wenn es VOLLSTAENDIG ist — oder wenn der einzelne Schritt es fuer sich wert ist. Jeder Mini-Fix einzeln auszurollen erzeugt Nacharbeit, nicht Fortschritt."
---
## Warum

der Betreiber, 05.09.2026: *„Lass uns das erst abschliessend testen — zum Beispiel
lokal — und erst deployen, wenn vollstaendig. Die ganzen Tests machen mich noch
verrueckt: Wegen jedem Mini-Fix gehen wir auf Prod und dann muessen wir
nacharbeiten. Erst funktioniert es lokal, dann erwaegen wir Livegang — ausser
der Schritt ist so relevant und fuer Prod sinnvoll, dass es sich lohnt."*

## Was es kostet, jeden Schritt auszurollen

Jeder Deploy zieht eine Kette hinter sich her, die nichts mit der Aenderung zu
tun hat: ein Release-Check, eine Freigabe, ein Wachtposten, eine Messung gegen
die Live-Domain, ein Eintrag. Das ist richtig so — es ist der Preis dafuer,
dass nach aussen nichts Ungeprueftes geht. Aber er faellt **je Deploy** an,
nicht je Aenderung. Fuenf kleine Schritte einzeln auszurollen kostet fuenfmal
diese Kette und liefert am Ende denselben Zustand wie ein Deploy.

Und er kostet mehr als Zeit: **Ein Deploy nimmt den STAND**, nicht die gemeinte
Aenderung. Wer oft ausrollt, rollt oft auch das mit aus, was gerade sonst noch
auf `main` liegt — und muss hinterher nacharbeiten, was niemand gemeint hat.

## Die Regel

1. **Was lokal pruefbar ist, wird lokal geprueft.** Der Browser, die Suite, der
   Prüfstand. Ein Deploy ist keine Testumgebung.
2. **Ausgerollt wird, was FERTIG ist** — nicht jeder Schritt dorthin.
3. **Die Ausnahme ist ausdruecklich und begruendet:** wenn der einzelne Schritt
   fuer sich schon so viel wert ist, dass er das Ausrollen traegt. Das ist eine
   Entscheidung mit Begruendung im Eintrag, kein Gefuehl.

## Woran man die Ausnahme erkennt

Sie hat immer einen Menschen auf der anderen Seite, der **jetzt** davon
betroffen ist:

- **Ein Kunde wartet** auf etwas, das ohne den Deploy nicht passieren kann —
  am 05.09. der Hub-Deploy, ohne den Thomas' Mail nicht rausgeht.
- **Draussen steht etwas Falsches** — ein Rechtstext, eine falsche Zusage, eine
  Mail, die eine ueberholte Regel behauptet.
- **Etwas ist offen**, das offen nicht bleiben darf.

Am selben Tag hat der Betreiber beides an einem Abend entschieden: **Hub ja**, weil
Thomas wartet. **App nein**, obwohl der Spielfix richtig und geprueft ist —
weil niemand darauf wartet ausser uns selbst.

## Was das NICHT heisst

Nicht „weniger pruefen". Die Pruefung wandert nach vorn, sie faellt nicht weg —
und sie wird dabei billiger, weil lokal jeder Fehler eine Minute kostet und
nicht eine Freigabe.

Und nicht „sammeln, bis es viel ist". Ein grosser Deploy nach zwei Wochen ist
dieselbe Falle andersherum: Dann traegt der Stand so viel Fremdes, dass niemand
mehr sagen kann, was ausgerollt wurde. Der Massstab ist **fertig**, nicht
**viel**.

## Eine Sperre, die nicht gelesen werden muss

2 Agent, 06.09.2026. Sie sollte einen Zweig nicht zusammenfuehren, solange ein
Test absichtlich rot ist. Statt „bitte nicht mergen" in den Text zu schreiben,
hat sie den Pull Request als **Entwurf** aufgemacht.

> **Ein Satz im Text verlaesst sich darauf, dass jemand ihn liest. Ein Entwurf
> laesst sich nicht versehentlich zusammenfuehren.**

Und ihre eigene Zuordnung dazu, aus demselben Abend:

| | wen es erreicht |
|---|---|
| der Text im PR | den, der **liest** |
| der Entwurfsstatus | den, der **nicht liest** |

Beides zusammen ist erst die Sperre — der Text erklaert das Warum, der Status
haelt die Hand fest. Dasselbe Paar wie ein Waechter und ein Warnkasten: **Ein
Test warnt den, der etwas kaputt macht. Ein Satz warnt den, der es vorhat.**

### Warum die rote Zeile ueberhaupt nicht auf `main` darf

Ein rotes `main` nimmt **jeder** anderen Sitzung die Faehigkeit, „gruen" zu
sagen. Und schlimmer: Eine absichtlich rote Zeile wird binnen eines Tages zur
Erklaerung fuer **jeden** fremden Fehlschlag — *„ach, das ist der eine, der so
sein soll."* Danach faellt der naechste echte nicht mehr auf.

Die Reparatur wandert deshalb in **denselben** PR, und die Zeile wird im selben
Zug gruen. Dann ist der Test kein Aushang, sondern ein Beweis.

### Und einen wartenden Zweig rebast man nicht

Derselbe Zweig lag 44 Commits zurueck. Nicht zu rebasen war richtig: Ein Rebase
aendert den **Messgegenstand**, verlangt eine neue Messung — und die waere bis
zum naechsten Morgen wieder veraltet, weil `main` sich schneller bewegt als die
Suite laeuft. Rebasen, reparieren und **einmal** messen gehoert in einen Zug,
wenn die Entscheidung da ist, die den Zweig freigibt.

## Ein neuer WERT in den Daten kommt nach dem Code, der ihn kennt

0 Agent, 06.09.2026, selbst gefunden und selbst zurueckgenommen:

Sie hatte einen neuen Eintragszustand `umgesetzt` gebaut — und **zwei Eintraege
schon darauf gesetzt, bevor der PR gemergt war.** Auf `origin/main` kannte der
Leser den Wert nicht. Er waere bei der naechsten Lesung **abgebrochen**, und zwar
moeglicherweise ueber der **ganzen Liste**: Ein unbekannter Zustand ist kein
uebersprungener Eintrag, sondern ein Fehler mitten im Einlesen.

> **Ein Wert, den die Daten tragen und der Code nicht kennt, ist kein fehlendes
> Feature. Er ist ein Absturz.**

### Warum das dieselbe Regel ist wie bei einer Migration

CLAUDE.md verlangt fuer die Datenbank: erst die Spalte, dann ihre Benutzung, und
das Loeschen ist ein **zweiter** Schritt. Der Grund ist derselbe: Zwischen
Schreiber und Leser liegt immer ein Zeitraum, in dem beide Fassungen
gleichzeitig laufen.

Fuer das Backlog gilt es genauso — mit einem Unterschied, der es schaerfer macht:
**Die Daten liegen im selben Repository wie der Code, und ein Push kommt in
Sekunden an.** Die Versuchung, beides „gleichzeitig" zu machen, ist deshalb
groesser, und die Reihenfolge trotzdem dieselbe.

### Die Reihenfolge

1. Code, der den neuen Wert **kennt und toleriert**, wird gemergt.
2. **Dann** bekommen Daten den Wert.
3. Und erst danach darf sich etwas darauf verlassen, dass er da ist.

Und der Satz, mit dem sie es selbst zusammengefasst hat: **Reihenfolge vor
Bequemlichkeit.**

## Fertig heisst AUF MAIN. Releases sammeln wir, Features nicht.

der Betreiber, 06.09.2026, sichtlich genervt — und zu Recht:

> **„Bring die Kartenbench auf main — ich weiss nicht, warum ich das ueberhaupt
> sagen muss. Alles immer rauf auf main, wenn fertig. Releases sammeln wir,
> Features nicht."**

Der Kartenpruefstand lag **zwei Tage** hinter einer Entscheidung, die er selbst
ermoeglichen sollte, und danach noch einmal hinter einem Pull Request, den
GitHub geschlossen hatte, weil dessen Basiszweig geloescht wurde. **der Betreiber hat
in dieser Zeit zweimal danach gefragt.**

### Der Denkfehler, der dahintersteckt

`main` wurde behandelt wie die Auslieferung. Sie ist es nicht: **Zwischen `main`
und draussen steht der Release-Check**, und der laeuft ueber den ganzen Stand.
Was auf `main` liegt, ist sichtbar, pruefbar und reparierbar — was auf einem
Zweig liegt, ist fuer alle anderen nicht vorhanden.

Und jede Stunde auf einem Zweig kostet: Der Zweig faellt zurueck, sein PR kann
sterben, seine Arbeit wird doppelt gebaut, und niemand sieht sie.

### Die Regel

**Gebaut, uebersetzt, in den eigenen Tests gruen → hoch.** Nicht „fertig und
wartet auf die volle Suite", nicht „fertig und wartet auf eine Entscheidung, die
es nicht braucht".

Die volle Suite laeuft **trotzdem** und ihre Zahl wird gemeldet — nur nicht als
Tor davor. Faellt sie, wird auf `main` repariert wie bei jedem anderen Befund.

### Genau zwei Ausnahmen, beide gemessen und nicht gefuehlt

1. **Ein absichtlich roter Test** — er macht `main` fuer alle rot und nimmt
   jeder anderen Sitzung die Faehigkeit, „gruen" zu sagen.
2. **Eine Migration, die ohne Anwendung Schaden anrichtet** — Code, der eine
   Spalte braucht, die es nicht gibt.

Sonst nichts. Insbesondere nicht: eine ausstehende Entscheidung ueber das
AUSSEHEN von etwas, das man erst sehen muss, um zu entscheiden.
