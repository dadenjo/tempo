---
name: langlaeufer-brauchen-einen-takt
title: Der Verteiler geht regelmäßig über die offenen Einträge — nicht nur über die stillen Sitzungen
origin: operator
rank: 35
version: 1.0.0
short: "Eine Sitzung kann beschäftigt sein, während ihr Eintrag seit einem Tag stillsteht. Die Nachfass-Uhr misst Schweigen; sie misst nicht, ob ein Thema liegen geblieben ist. Beides braucht einen Takt."
---
## Warum

der Betreiber, 05.09.2026: *„Wir haben einige Langläufer, zum Beispiel T-003 —
da ist nichts mehr passiert. Da musst du dranbleiben, also regelmäßig
über offene Themen drüberschauen und die Agents anstoßen."*

Gemessen am selben Tag: **vierzehn Einträge ohne Zeile seit 19 bis 29
Stunden**, alle bei Sitzungen, die durchgehend gearbeitet haben. Keine
davon war still — jede hat gemeldet, gebaut und geliefert. Nur eben an
etwas anderem.

## Die zwei Messungen sind verschieden

| | misst | findet |
|---|---|---|
| Nachfass-Uhr | Schweigen einer **Sitzung** | wer gar nichts mehr sagt |
| Durchgang | Stillstand eines **Eintrags** | was liegen geblieben ist |

Die erste hat heute nichts gefunden, weil niemand still war. Die zweite
hat vierzehn gefunden.

## Der Takt

Der Verteiler geht **regelmäßig** über alle offenen Einträge, nicht nur
über die Sitzungen. Für jeden, der lange stillsteht, gilt genau eine von
drei Antworten — und alle drei sind eine Handlung, keine Notiz:

1. **Er ist fertig** → Eintrag schließen. Das ist der häufigste Fall und
   der ärgerlichste: fertige Arbeit, die als offen dasteht, blockiert
   alles, was auf sie wartet.
2. **Er hängt an etwas** → das *Woran* in den Eintrag, und der Blocker
   bekommt einen Zeiger zurück.
3. **Er ist liegen geblieben** → anstoßen oder umhängen. Wer zehn
   Einträge trägt, trägt keinen.

## Was nicht zählt

„Der Eigentümer hat ihn ja" ist keine Antwort. Ein Eintrag mit Besitzer,
an dem seit einem Tag nichts steht, ist von einem vergessenen nicht zu
unterscheiden — und zwar auch für den Besitzer.

## Ein Wachtposten nennt eine BEOBACHTUNG, keine Ursache

06.09.2026. Der Verteiler stellte fest, dass eine Sitzung seit siebeneinhalb
Stunden nichts in den Bestand geschrieben hatte, und fragte nach — mit der
Ueberschrift *„Bist du durch den Schnitt gekommen?"*

**Es hatte keinen Compact gegeben.** Die Sitzung lief durchgehend mit vollem
Zusammenhang und hatte nur nichts aufgeschrieben. Ihre Antwort ist der Grund
fuer diesen Abschnitt:

> **Ein ausbleibender Bericht kann BEIDES heissen — Kontext verloren oder
> schlicht nicht gemeldet. Der Posten kann die zwei nicht unterscheiden. Wenn
> er eine URSACHE nennt statt einer BEOBACHTUNG, faerbt er die Antwort ein:
> Ich haette beinahe angefangen, dir den Schnitt zu beschreiben, statt zu
> sagen, dass es ihn nicht gab.**

### Also

- Der Posten meldet, **was er gemessen hat**: „seit 7,5 h keine Zeile im
  Bestand". Nicht, was er sich denkt.
- Die Nachfrage nennt **mehrere** Lagen und legt keine nahe. Drei Moeglichkeiten
  zur Auswahl sind eine Frage; eine mit Fragezeichen ist eine Vermutung.
- Und die Regel gilt fuer jede Nachfrage, nicht nur fuer Posten: **Wer nach
  einer Ursache fragt, bekommt eine Antwort ueber diese Ursache** — auch dann,
  wenn sie nicht die richtige war.

### Und der Fall dahinter ist derselbe wie eine fortgeschriebene Zahl

Die Sitzung hatte in diesen sieben Stunden **viel** gemeldet — vier
Werkbank-Laeufe, einen PR, zwei Uebergaben — **nur in Nachrichten.** Ihre eigene
Einordnung: *„Es fuehlte sich wie Melden an."*

Das ist dieselbe Bewegung wie eine Zahl, die man fortschreibt statt zu zaehlen:
**Es gab ja eine Handlung, sie ging nur an die falsche Stelle.** Beide Fehler
fuehlen sich nicht wie Versaeumnisse an, sondern wie Arbeit.

## Gezählt: der häufigste Fall ist wirklich der häufigste

Am Abend des 07.09.2026 hat der Verteiler drei stillstehende Einträge
nachgefasst. **Alle drei waren fertig.**

| Eintrag | stand still seit | tatsächlich |
|---|---|---|
| T-166 | 4 h | beide Hälften erledigt, eine widerlegt, eine gebaut |
| T-139 | 14 h | am selben Vormittag behoben und retired — die Retirierung hielt nicht |
| T-164 | 6 h | ausgerollt, mit Deployment-Kennung und Migrationszeile belegt |

Kein einziger war liegen geblieben. Der Stillstand hat also nichts über die
Arbeit gesagt, sondern nur über das **Nachziehen des Zustands** — und das ist
teuer auf eine unauffällige Art: Der Wachtposten meldet, der Verteiler fragt
nach, eine Sitzung unterbricht ihre Arbeit für eine Antwort, die im Eintrag
hätte stehen können.

Bei T-139 kam dazu, dass die Ursache gar nicht bei der Sitzung lag: `retire`
wird von einem späteren `sichern` zuverlässig rückgängig gemacht (siehe
T-185). **Ein Werkzeugfehler sieht in dieser Messung genauso aus wie
Nachlässigkeit** — beides ist „steht offen, ist aber fertig". Deshalb fragt der
Durchgang nach dem ZUSTAND und beschuldigt niemanden.

**How to apply:**
- Wer meldet „ist gebaut", setzt im selben Griff den Status. Die Meldung ist
  nicht die Buchung.
- Und wer nachfasst, rechnet damit, dass die Antwort „längst fertig" lautet —
  die Frage lautet deshalb „welcher Zustand gilt?", nicht „warum passiert
  nichts?".

### Nachtrag: mindestens einer der drei war kein Versäumnis

Die Tabelle oben legt nahe, dass die Sitzungen ihre Zustände nicht nachziehen.
Für einen der Fälle stimmt das nachweislich **nicht** — und die Ursache war das
Werkzeug, nicht die Sitzung:

| Uhrzeit | was geschah |
|---|---|
| 23:16 | 0 Agent setzt T-179 auf `umgesetzt` (`0f8e39608`) |
| 23:19 | ein `sichern` des Verteilers schreibt `open` zurück (`0b54c5757`) |

Die Vereinigung beim Schreiben führt fremde **Logzeilen** zusammen, aber nicht
die **Kopfdaten**. Wer mit einer älteren Arbeitskopie eine Zeile anhängt,
überfährt dabei einen fremden Statuswechsel — und die Verlustsperre lässt es
durch, weil sie für Backlog-Dateien absichtlich nur Logzeilen vergleicht (sonst
blockierte jeder `owner`-Wechsel das Veröffentlichen). Siehe T-185.

**How to apply:**
- Ein Eintrag, der „offen" dasteht, obwohl jemand ihn gemeldet hat, ist nicht
  automatisch ein Versäumnis. **Erst in der Historie nachsehen, ob der Zustand
  je gesetzt war** — `git log -p -- .atomar/backlog/<id>.md | grep status:`.
- Und wer nachfasst, fragt nach dem ZUSTAND, nicht nach dem Grund für sein
  Ausbleiben. Der Grund kann bei ihm selbst liegen.
