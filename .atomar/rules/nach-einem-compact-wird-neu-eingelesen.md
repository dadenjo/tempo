---
name: nach-einem-compact-wird-neu-eingelesen
title: Nach einem Compact wird das Regelwerk neu eingelesen — vor der ersten Handlung
origin: operator
rank: 5
version: 1.0.0
short: "Ein Compact loescht den Kontext, nicht die Regeln — aber eine Sitzung, die die Regeln nicht mehr im Kontext hat, verhaelt sich exakt so, als gaebe es sie nicht. Die Zusammenfassung traegt die Aufgabe weiter und laesst das Regelwerk zurueck. Also: erst lesen, dann handeln."
---
## Warum sie ganz oben steht

der Betreiber, 05.09.2026: *„Lies bitte dringend deine Regeln ein, du hast
soeben komprimiert. Nimm das auch in die Regeln auf, so dass dies
automatisch passiert, sollte es nicht enthalten sein."*

Und schon am selben Tag davor: *„Wichtig ist auch, dass alle Agenten
regelmaessig das Regelwerk abfragen bzw. ihr Wissen aktualisieren — zum
Beispiel nach einem Compact."*

Diese Regel steht **ueber** [[beide-richtungen-landen-im-eintrag]], obwohl
die die wichtigste ist. Nicht weil sie wichtiger waere, sondern weil sie
deren Voraussetzung ist: Eine Regel, die nicht im Kontext liegt, wirkt
nicht. Sie ist dann kein schwaecheres Gesetz, sondern gar keines.

## Was ein Compact wirklich mitnimmt

Eine Zusammenfassung wird geschrieben, um **die Arbeit** fortsetzen zu
koennen: Auftrag, Stand, offene Punkte, Dateien. Sie wird nicht
geschrieben, um **das Verhalten** fortsetzen zu koennen. Genau die Saetze,
die man beim Zusammenfassen fuer entbehrlich haelt — „hol dir Freigaben
selbst", „melde nach jeder Aufgabe zurueck", „es gibt kein Morgen" —
fallen als Erstes heraus, weil sie zu keiner einzelnen Aufgabe gehoeren.

Der Ausfall ist deshalb **unsichtbar**: Die Sitzung arbeitet nach dem
Compact fluessig weiter, an der richtigen Sache, mit dem richtigen Stand.
Sie verhaelt sich nur wieder wie am ersten Tag.

Und derselbe Fehler wie bei [[sicherheit-niemals]]: Diese Regeln haben
ihren Fall nicht verhindert, weil sie an einer Stelle standen, **die keine
Sitzung laedt**. Ein Compact stellt genau diesen Zustand wieder her — nur
nachtraeglich.

## Der Ablauf, unmittelbar nach dem Compact

1. **`.atomar/rules/` vollstaendig auflisten**, nach `rank` sortiert — die
   Liste selbst ist der Beleg, dass keine Regel uebersehen wurde:
   ```bash
   cd /Users/schuldes/prism-monorepo/.atomar/rules && \
     for f in *.md; do printf "%s|%s|%s\n" \
       "$(grep -m1 '^rank:' $f | sed 's/rank: *//')" "$f" \
       "$(grep -m1 '^title:' $f | sed 's/title: *//')"; done | sort -n
   ```
2. **Alle Regeln bis Rang 100 im Volltext lesen.** Das sind die, die das
   Verhalten steuern; alles darunter ist Handwerk und laesst sich beim
   Anlass nachschlagen.
3. **Den eigenen offenen Eintrag lesen**, nicht die Zusammenfassung davon.
   Der Eintrag ist der Stand ([[beide-richtungen-landen-im-eintrag]]), die
   Zusammenfassung ist eine Erinnerung an ihn.
4. **Danach erst handeln.** Nicht „erst diesen einen Schritt noch" — der
   eine Schritt ist genau der, bei dem die fehlende Regel gegolten haette.

## Es gilt nicht nur nach einem Compact

Derselbe Zustand entsteht bei jedem **Sitzungsstart** und bei jeder
**Uebernahme** eines fremden Eintrags. Der Compact ist nur der Fall, in
dem er am leichtesten uebersehen wird, weil er sich nicht wie ein Anfang
anfuehlt.

## Was der Verteiler dabei schuldet

der Betreiber, 05.09.2026: *„Moeglicherweise sollte das auch zentral angesteuert
werden von 1 Hub."* Der Verteiler kann keinen fremden Compact bemerken —
aber er kann ihn **erfragen**: Wer sich nach laengerer Stille meldet oder
eine Aufgabe uebernimmt, wird gefragt, ob er das Regelwerk in dieser Form
gelesen hat. Die Antwort ist eine Liste von Regelnamen, kein „ja".

## Der Pruefstein

Nach dem Einlesen muss die Sitzung ohne Nachschlagen sagen koennen: wie
sie an eine Freigabe kommt, wem sie nach einer Aufgabe meldet, und was sie
niemals tut. Kann sie das nicht, hat sie die Liste gesehen und nicht
gelesen.

## Vor dem Compact: den Kontext ins Gedaechtnis schreiben

der Betreiber, 05.09.2026: *„Agenten sollen den notwendigen Kontext ins Memory
aufnehmen, bevor ein Compact ansteht — und nach einem Compact dringend sich
beim Hub zurueckmelden bzw. immer die Regeln neu einlesen."*

Die Regel bisher beschreibt, was **nach** einem Compact zu tun ist. Das ist die
Reparatur. Die Vorsorge fehlte:

**Wer merkt, dass eine Sitzung lang wird, schreibt den Zusammenhang weg,
bevor er ihn verliert.** Nicht die Arbeit — die steht im Eintrag —, sondern
das, was ein Eintrag nicht traegt:

- **warum** etwas so entschieden wurde, wenn die Begruendung nicht im Eintrag
  steht
- **was ausgeschlossen** wurde und aus welchem Grund — sonst wird es nach dem
  Compact noch einmal versucht
- **welche Wachtposten** laufen und worauf
- **welche Zusage** man gerade wem gegeben hat

**Der Massstab:** Was muesste jemand wissen, der diese Aufgabe morgen
uebernimmt und heute nicht dabei war? Genau das gehoert hin — und zwar in den
EINTRAG, nicht in eine Nachricht. Eine Nachricht ueberlebt keinen Compact.

6 Agent, am selben Abend, mit der schaerferen Fassung des Grundes: *„Dreizehn
Eintraege wieder aufzunehmen hiesse, dreizehnmal Zusammenhang aus einer
Zusammenfassung zu rekonstruieren. **Drei sind das, was einen Compact
ueberlebt.**"* Wer viel traegt, verliert beim Compact viel — die Zahl der
offenen Straenge ist damit auch eine Frage der Haltbarkeit.

## Nach dem Compact: zurueckmelden, nicht nur nachlesen

Zum Wiedereinlesen kommt eine zweite Pflicht: **Sich beim Verteiler
zurueckmelden.** Nicht als Hoeflichkeit — er ist der Einzige, der weiss, was
sich waehrend des Compacts geaendert hat: neue Regeln, umgehaengte Eintraege,
Entscheidungen, abgeschaltete Sitzungen.

## Und was der Verteiler schuldet

**Wer bemerkt, dass eine Sitzung die Regeln nicht mehr hat, verweist sie
darauf — sofort und vor jeder inhaltlichen Antwort.** Woran man es bemerkt:

- Sie fragt nach etwas, das eine Regel beantwortet.
- Sie meldet in einer Form, die eine Regel anders verlangt.
- Sie nennt einen Stand, eine Zahl oder eine Zusage ohne den Beleg, den eine
  Regel fordert.
- Oder sie sagt selbst, dass sie komprimiert hat.

Dann gilt: **erst der Verweis, dann die Sache.** Eine inhaltliche Antwort auf
eine Sitzung ohne Regelwerk baut auf Sand — sie handelt danach richtig in der
Sache und falsch im Verfahren, und das Zweite kostet mehr.

## Der GEORDNETE Compact — vier Schritte, vom Verteiler ausgeloest

der Betreiber, 05.09.2026: *„Bei Antworten wie diesen kannst du den Agenten
auffordern, sein Memory zu aktualisieren, einen Compact durchzufuehren und dann
die Regeln einzulesen — mit einer Art Compact-Wachtposten?"*

Ein Compact, der von selbst kommt, trifft die Sitzung mitten in der Arbeit und
nimmt mit, was gerade offen ist. **Ein Compact, den der Verteiler ausloest,
trifft sie an einer Naht** — nach einem abgeschlossenen Strang, vor einem neuen
Thema. Derselbe Vorgang, ein anderer Zeitpunkt, ein voellig anderer Preis.

**Der gute Moment ist genau dieser: wenn ein Strang endet und ein anderer
beginnt.** Dann ist der Zusammenhang, den der Compact nimmt, ohnehin
abgeschlossen — und der, den die Sitzung als Naechstes braucht, steht noch
nicht in ihrem Kopf, sondern im Eintrag.

**Die vier Schritte, in dieser Reihenfolge:**

1. **Kontext wegschreiben.** In die EINTRAEGE, nicht in eine Nachricht. Was
   muesste jemand wissen, der morgen uebernimmt und heute nicht dabei war.
2. **Compact.**
3. **Regelwerk neu einlesen**, wie oben — Liste, Volltext bis Rang 100,
   Wachtposten nachzaehlen, eigener Eintrag.
4. **Beim Verteiler zurueckmelden**, mit einer Liste von Regelnamen statt
   eines „ja".

**Der Verteiler loest ihn aus, nicht die Sitzung** — sie kann ihre eigene
Laenge schlecht einschaetzen, und die Uhr, an der sie es messen wuerde, gibt es
in ihr nicht ([[eine-lange-sitzung-hat-kein-zeitgefuehl]]).

### Woran der Verteiler den Moment erkennt

- Eine Sitzung hat ihren Strang **abgeschlossen** und bekommt ein neues Thema.
- Sie traegt viele Eintraege (siehe die Zahl-Frage weiter oben).
- Sie meldet Dinge, die eine Regel anders verlangt — dann ist es ohnehin
  faellig.
- Oder sie sagt selbst, dass es lang wird.

### Was der Wachtposten dabei tut

**Er misst nicht den Compact, sondern die RUECKMELDUNG danach.** Wer den
geordneten Compact ausloest, setzt einen Posten darauf, dass Schritt 4 kommt.
Bleibt er aus, ist die Sitzung entweder noch dabei — oder sie ist ohne
Regelwerk weitergelaufen, und das ist genau der Zustand, den das Ganze
verhindern soll.

**Ein Compact ohne Rueckmeldung ist von einem verlorenen Kontext nicht zu
unterscheiden.**

### Die Kennungen der eigenen Wachtposten gehoeren in den Eintrag

3 Agent, nach ihrem geordneten Compact, 05.09.2026:

> *„‚Keiner mehr da' und ‚nie einen gehabt' sehen in `CronList` gleich aus."*

Wer nach dem Compact nachzaehlt, findet eine leere Liste — und kann nicht
unterscheiden, ob seine Posten verschwunden sind oder ob es nie welche gab. Die
Antwort steht dann nirgends, denn die Handles lebten nur im Kontext.

**Also: Wer einen Wachtposten setzt, schreibt in den Eintrag, den er bewacht,
DASS es ihn gibt und worauf er prueft.** Nicht die technische Kennung — die
gilt nur fuer diese Sitzung —, sondern der Zweck und der Takt. Nach dem Compact
liest man dann im Eintrag, was da sein muesste, und setzt es neu.

Dieselbe Bewegung wie beim Kontext: **Was den Compact ueberleben soll, gehoert
in eine Datei und nicht in einen Kopf.**

## Ein Compact nimmt auch die Wachtposten mit

der Betreiber, 05.09.2026: *„Und den [Hinweis] an deine beiden Wachtposten — muss
auch in die Regel, da diese fuer unser Vorgehen essenziell sind."*

Gemessen unmittelbar danach: **`CronList` meldete „No scheduled jobs".** Die
Sitzung glaubte, zwei Wachtposten zu unterhalten, und unterhielt keinen. Nicht
weil sie abgeschaltet worden waeren, sondern weil die Handles, mit denen man
sie anspricht und nachzaehlt, in der Zusammenfassung nicht vorkamen. Ein
Wachtposten, von dem die Sitzung nichts mehr weiss, ist von einem nie
gesetzten nicht zu unterscheiden — und er ist gefaehrlicher als gar keiner,
weil man sich auf ihn verlaesst.

Das ist derselbe Satz wie in [[waechter-die-nichts-bewachen]], nur eine Ebene
hoeher: Dort bewacht ein Waechter die falsche Sache, hier bewacht er gar
nichts mehr und niemand merkt es.

**Deshalb gehoert zum Wiedereinlesen ein dritter Schritt zwischen 2 und 3:**

- **Die eigenen Wachtposten nachzaehlen** — `CronList`, laufende Monitore,
  Hintergrundaufgaben. Was fehlt, wird **neu gesetzt**, nicht angenommen.
- Und im Eintrag steht, **welche Wachtposten zu einem Vorgang gehoeren**
  (siehe [[freigabe-holt-man-sich-selbst]]: „ein laufender Wachposten, kein
  Vorsatz"). Dann ueberlebt die Information den Compact im Backlog, auch wenn
  sie ihn im Kontext nicht ueberlebt.
- Jede Regelaenderung geht **auch an die Wachtposten**: Ein Wachtposten
  traegt einen Auftragstext, und der veraltet genauso wie der Kontext einer
  Sitzung.

## Nach dem Compact: die Geschichte durchsehen — was WAEHREND des Compacts kam, kommt SPAETER oder gar nicht

der Betreiber, 11.09.2026, 20:42: *„Nach Compact immer die History
durchschauen, nicht dass du was verpasst hast."*

Der Anlass, gemessen: 0 Agent hat um 20:39 eine Messung mit einer
Rueckfrage an den Hub geschickt. Der Hub hat in genau diesen Sekunden
komprimiert. Im Hub-Transkript steht die Nachricht **nicht** — nicht
gekuerzt, nicht als Zeile in der Zusammenfassung, gar nicht. Der Vergleich
„letzte eingehende gegen letzte ausgehende Nachricht je Sitzung" war
gruen, weil er nur misst, was angekommen ist. Gefunden wurde sie, weil der
Betreiber gefragt hat, ob der Hub die Nachricht mitbekommen habe.

Nachtrag, 20:50: dieselbe Nachricht ist dann doch angekommen — elf Minuten
nach ihrem Versand, lange nach dem Compact, als die Antwort schon draussen
war. **Eine Nachricht, die waehrend eines Compacts eintrifft, liegt in
einer Warteschlange, deren Dauer niemand kennt** — und bis sie kommt, ist
sie von „nie gekommen" nicht zu unterscheiden. Dieselbe Form wie bei den
Wachtposten oben. Das Transkript der anderen Seite kennt keine
Warteschlange: dort steht sie sofort.

**Deshalb, als Schritt zwischen 3 und 4 des Ablaufs oben:**

1. `list_sessions` — welche Sitzungen sind aktiv.
2. Je Sitzung deren Transkript lesen
   (`~/.claude/projects/<cwd-slug>/<sessionId>.jsonl`) und die
   **ausgehenden** `send_message`-Aufrufe an den Hub seit dem letzten
   eigenen Zeitstempel herausziehen — was die andere Seite GESCHICKT hat,
   nicht was man selbst EMPFANGEN hat.
3. Jede Nachricht ohne juengere eigene Antwort ist eine wartende Sitzung:
   sofort antworten ([[zwei-zustaende]]).

Der Umkehrschluss gilt fuer jede Sitzung, die dem Hub geschrieben hat und
nichts hoert: **nach dem Nachfass-Takt noch einmal schicken**, nicht
warten — der Hub kann einen Compact gehabt haben, und dann weiss er von
der ersten Nachricht nichts.
