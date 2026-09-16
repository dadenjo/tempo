---
name: werte-die-das-system-kennt-werden-nicht-getippt
title: Werte, die das System kennt, werden nicht getippt — sie werden erfragt
origin: operator
rank: 44
version: 1.0.0
short: "Zeit, Nummer, Version, Kennung, Zusage: Wo eine Maschine die Antwort hat, ist eine getippte Zahl eine Behauptung. Sie ist am Anfang fast richtig, sie altert lautlos, und sie stumpft spaeter die Pruefung, mit der man ihren Fehler faende."
---
## Warum

der Betreiber, 05.09.2026, nach dem Verlust eines Backlog-Eintrags und zwoelf
falschen Zeitstempeln: *„Und genau da muessen wir das Regelwerk erweitern — wie
wir das verhindern koennen."*

## Fuenf Faelle an einem Tag, alle dieselbe Form

| Wert | getippt | die Maschine wusste | Folge |
|---|---|---|---|
| **Zeitstempel** in zwoelf Eintraegen | aus dem Gespraechsverlauf geschaetzt | `date -u` | bis zu **4 Stunden** in der Zukunft |
| **npm-Version** im Hub | `0.27.6` fest im Code | die Registry: **1.1.0** | seit Monaten falsch, niemand sah es |
| **Migrationsnummer** | fortgezaehlt | der Bestand | zweimal `0021`, einmal `0023` |
| **Ticketnummer** | vom Werkzeug still ersetzt | die Vergabe | ein Eintrag acht Stunden verloren |
| **„60 Minuten"** auf einem Werbeschild | *fast* getippt | `PREMIUM_MINUTES_ALLOWANCE` | verhindert, weil jemand fragte |

Nur der letzte ging gut aus, und zwar weil die bauende Sitzung sich die Auflage
**selbst** gegeben hat.

## Warum getippte Werte so schwer zu finden sind

1. **Sie sind am Anfang richtig.** Niemand tippt eine falsche Zahl. Sie wird
   falsch, waehrend die Datei stillsteht — ein Wert, der aus einem **Bestand**
   stammt, ist keine Eigenschaft der eigenen Datei.
2. **Sie altern lautlos.** Kein Test faellt, kein Werkzeug warnt. `0.27.6`
   stand drei Monate im Hub und sah jeden Tag richtig aus.
3. **Sie sind plausibel.** Eine erfundene Uhrzeit liegt neben der echten; ein
   fortgezaehlte Nummer neben der freien. Der Fehler faellt nicht auf, weil er
   klein ist.
4. **Und sie stumpfen die Pruefung, mit der man sie faende.** Das ist die
   teuerste Folge: Als der verlorene Eintrag gesucht wurde, war die
   Zeitordnung das einzige Werkzeug — und sie bestand aus geschaetzten Werten.
   **Wer Zeit erfindet, verliert die Faehigkeit, Reihenfolgen zu belegen.**

## Der getippte Wert war meistens EINMAL richtig

6 Agent, 05.09.2026, beim Lesen dieser Regel:

> *„In vier von fuenf Faellen war der getippte Wert einmal richtig. Er ist
> nicht falsch entstanden, sondern falsch GEWORDEN."*

Das unterscheidet ihn vom Tippfehler und macht ihn schwerer zu finden: **Er hat
eine Vergangenheit, in der er stimmte.**

- `0.27.6` war die Version — im Juni.
- `0021` war die naechste freie Nummer — vor der anderen Anlage.
- Mein erster Zeitstempel lag **sechs Minuten** daneben und war praktisch
  richtig; der zwoelfte vier Stunden.

**Deshalb hilft „einmal pruefen" nicht.** Ein Tippfehler ist beim ersten
Hinsehen falsch; ein getippter Wert wird es irgendwann, ohne dass jemand etwas
tut — und niemand sieht noch einmal hin, weil er beim letzten Mal gestimmt hat.

Wer einen solchen Wert findet, sucht deshalb nicht nach dem Moment, in dem
jemand sich vertippt hat. **Es gibt ihn nicht.**

## Die Regel

**Vor jedem Wert, den man hinschreiben will, die Frage: Weiss das eine
Maschine?** Wenn ja, wird sie gefragt — auch wenn es laenger dauert und auch
wenn man die Antwort zu kennen glaubt.

| statt | fragen |
|---|---|
| die Uhrzeit schaetzen | `date -u +%Y-%m-%dT%H:%M:%SZ` |
| die naechste Nummer fortzaehlen | den Bestand messen — und **vor dem Zusammenfuehren**, nicht beim Schreiben |
| eine Version hinschreiben | die Quelle lesen, die sie fuehrt |
| eine Zusage abtippen | aus der Konstante lesen, aus der auch alle anderen lesen |
| eine Kennung annehmen | sich die vergebene zurueckgeben lassen |

**Und wo ein Wert doch von Hand stehen muss**, steht daneben, **woher er
stammt und wann er zuletzt stimmte**. Ein Wert ohne Herkunft ist eine
Behauptung mit Verfallsdatum, das niemand kennt.

## Fuer Werkzeuge

Ein Werkzeug, das einen getippten Wert **still ersetzt oder ignoriert**, baut
denselben Fehler ein, den diese Regel verhindern soll. Am 05.09. nahm `create`
eine mitgegebene Kennung entgegen und vergab **stillschweigend eine andere** —
wer glaubte, `T-001` anzulegen, bekam `T-002` und erfuhr es nicht.

**Entweder das Werkzeug fuehrt den Wert, dann weist es eine Angabe ab. Oder der
Aufrufer fuehrt ihn, dann muss sie gelten.** Beides zugleich ist die Falle.

## Verwandt

[[eine-lange-sitzung-hat-kein-zeitgefuehl]] · [[migrationsnummer-wird-gemessen]] · [[etwas-das-erfolg-meldet-und-nichts-tut]] · [[messen-statt-vermuten]]

## Ein NAME ist keine Kennung

2 Agent, 06.09.2026, nachdem ihr neun Commits einer anderen Sitzung
zugeschrieben worden waren:

```
git log --format=%an   →   der Betreiber Schuldes <dadenjo@gmail.com>   (alle neun)
```

**Das ist die git-Identitaet der MASCHINE.** Jede Sitzung committet darunter.
Der Autorname sagt, an welchem Rechner committet wurde — nicht, von welcher
Sitzung. Dieselbe Form wie `pgrep -f run-tests.mjs`, das am selben Tag zwei
Suiten fand und nicht sagen konnte, wem sie gehoeren.

Und es ist dieselbe Form wie der Urheber der Backlog-Ansicht, der aus einem
Startargument kommt: **Ueberall dort, wo ein Name aus der Umgebung stammt und
nicht aus einer Anmeldung, benennt er den Ort, nicht die Person.**

### Woran der Verteiler den Fehler gemacht hat

Nicht an den git-Daten — an einer Zustandsmeldung. Eine Sitzung hatte
geschrieben: *„GEBAUT, AUF ZWEIG, NICHT AUF MAIN, PR FEHLT."* Daraus wurde
„sie hat es gebaut".

> **Eine Meldung UEBER etwas ist keine Meldung, dass man es getan hat.**

Wer eine Aufgabe zuweisen will, fragt die Sitzung — oder liest, wer die Arbeit
im Eintrag gemeldet hat, als sie entstand. Beides kostet eine Minute. Die
falsche Zuweisung kostete zwei Sitzungen je eine Messung und haette beinahe zu
einem Cherry-Pick aus fremdem Code gefuehrt.

## Eine fortgeschriebene Zahl ist ein getippter Wert mit einem Beleg von gestern

Der Verteiler, 06.09.2026, zweimal in einer Nacht an derselben Zahl:

```
„Wir haben 45 Regeln."   →  es waren 44   (korrigiert von 6 Agent)
„Es sind jetzt 46."      →  es sind 45    (selbst bemerkt, eine Minute spaeter)
```

**Beide Male wurde nicht gezaehlt, sondern gerechnet.** Die 44 war einmal
gemessen; danach kamen Erweiterungen, und aus *„das Regelwerk ist gewachsen"*
wurde stillschweigend *„eine Datei mehr"*. Die Erweiterungen waren **Abschnitte
in bestehenden Dateien** — keine neuen Regeln.

### Warum das schwerer auffaellt als eine erfundene Zahl

Eine erfundene Zahl ist eine Behauptung; man spuert beim Schreiben, dass man
nichts nachgesehen hat. Eine **fortgeschriebene** Zahl fuehlt sich wie
Buchfuehrung an: Es *gab* eine Messung, sie ist nur nicht mehr die Gegenwart.

Und beide Male stand der Fehler in einer Nachricht, in der ausdruecklich ueber
Belege gesprochen wurde.

### Also

- **Nicht fortschreiben. Nachzaehlen.** `ls … | wc -l` kostet eine Sekunde.
- Und die Frage, die den Fehler verhindert: **„Habe ich das gemessen, oder habe
  ich es aus etwas Gemessenem abgeleitet?"** Das Zweite ist eine Rechnung, und
  eine Rechnung veraltet mit jeder Annahme, die in sie eingeht.

## Eine runde Zahl ist ein Gestaendnis

2 Agent, 06.09.2026, ueber ihren eigenen Zeitstempel:

```
created_at: "2026-09-06T00:00:00Z"      ← Mitternacht auf die Sekunde
echt:        2026-09-06T03:39:00Z
```

Ihre Einordnung, und sie ist schaerfer als „Zeitstempel nachschlagen":

> **00:00:00 auf die Sekunde kann niemand gemessen haben.**

Eine runde Zahl an einer Stelle, an der eine Messung stehen soll, verraet sich
selbst — man muss sie nicht pruefen, man muss sie nur ansehen. Dasselbe gilt fuer
`0`, `100`, `1000`, glatte Prozentwerte und jedes Datum ohne Uhrzeit.

### Und das leere Feld ist besser als der Platzhalter

> **Ein leeres Feld ist eine Luecke, die jemand fuellt. Ein Platzhalter, der wie
> eine Messung aussieht, ist eine, die niemand mehr sieht.**

Das ist der Grund, warum diese Fehlerart teuer ist: Sie erzeugt nicht Unwissen,
sondern **Scheinwissen**, und Scheinwissen wird weitergerechnet.

### Der Verteiler hat dabei denselben Fehler in klein gemacht

Er schrieb zurueck: *„Kein Vorwurf — der Anlegebefehl setzt das offenbar so."*
**Das war geraten.** Die Datei war von Hand geschrieben; einen Befehl mit diesem
Fehler gibt es nicht. Ihre Antwort: *„Wenn du einen suchst, suchst du etwas, das
es nicht gibt."*

Eine erfundene **Ursache** ist derselbe Fehler wie ein erfundener **Wert** — nur
schickt sie zusaetzlich jemanden auf die Suche.

## Eine Zahl ohne ihre Frage ist keine Kontrollzahl

In einer Nacht, 05./06.09.2026, **fuenfmal** dieselbe Form — jedes Mal waren
beide Zahlen richtig und meinten Verschiedenes:

| gemeldet | tatsaechlich | der Unterschied |
|---|---|---|
| 161 Aufrufstellen | 156 | rohe Textstring-Treffer gegen **echte Aufrufe** (1 Definition, 3 Erwaehnungen in Kommentaren) |
| 40 rohe `fillText` | 38 ungeprueft | zwei lagen **innerhalb** der gepruefeten Funktionen |
| 13 Farbstellen | 14 | eine reiste durch eine Variable und fiel aus der Suche |
| 88 Befunde | 85 + 0 + 3 | die Tabelle zaehlte **ein** Format, die Ueberschrift **drei** |
| 45 Regeln | 44 | Abschnitte in bestehenden Dateien fuer neue Dateien gehalten |

**Keine dieser Zahlen war erfunden.** Jede war gemessen — nur an einer anderen
Frage als der, fuer die sie dann verwendet wurde.

### Woran man die brauchbare erkennt

0 Agents Kriterium, und es ist das schaerfste, das wir haben:

> **156 ist die belastbare Kontrollzahl, weil sie die ist, die `tsc` als
> Pflichtparameter tatsaechlich erzwingt.**

Eine Kontrollzahl ist die, die sich **bewegt, wenn etwas kaputtgeht**. Ein
`grep`-Treffer bewegt sich auch, wenn jemand einen Kommentar umformuliert — er
taugt zum Ueberblick und nicht zur Wache.

### Also

- **Jede Zahl nennt, was sie zaehlt** — „156 Aufrufstellen (ohne Definition und
  Kommentare)", nicht „156 Stellen".
- Und wenn zwei Eintraege zwei Zahlen fuer dieselbe Sache nennen: **beide stehen
  lassen, beide erklaeren.** Eine davon zu loeschen macht die andere nicht
  richtiger, nur einsamer.

### Und ein ODER in einem `grep -c` macht aus drei Fragen eine Zahl

2 Agent, 06.09.2026, ueber ihre eigene Grobzaehlung: Sie meldete
*„scratch: pp_scores 2 Treffer"*. Nachgelesen kommt `pp_scores` dort **null**
Mal vor — die zwei Treffer waren `submitScore`, weil drei Begriffe in **einem**
`grep` standen.

**Der Befund stimmte trotzdem, aber aus einem anderen Grund als die Zahl
behauptete.** Aufgefallen ist es nur, weil sie die Zahl als Grobzaehlung
gekennzeichnet und angekuendigt hatte, jede Stelle nachzulesen.

Also: **Eine Zaehlung je Frage.** Ein `-c` ueber eine Alternative zaehlt
Zeilen, in denen *irgendetwas* zutrifft — und niemand sieht der Zahl an, welches.
