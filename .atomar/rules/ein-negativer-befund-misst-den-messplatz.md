---
name: ein-negativer-befund-misst-den-messplatz
title: Ein negativer Befund misst immer zuerst den Messplatz
origin: operator
rank: 36
version: 1.0.0
short: "„Es gibt das nicht\" ist in einem falsch stehenden Baum, einem veralteten Server oder einer Abstammung nach dem Squash-Merge dasselbe Ergebnis wie „es fehlt wirklich\". Die Frage WAS FEHLT HIER ist erst beantwortbar, wenn WO STEHE ICH beantwortet ist."
---
## Der Satz

3 Agent, 06.09.2026, nachdem in derselben Nacht **zwei** negative Befunde
falsch waren — einer von ihr, einer vom Verteiler:

> **Ein negativer Befund misst immer zuerst den Messplatz.**

## Die zwei Faelle, aus denen er kommt

**Der 404.** Ein Dev-Server aus dem Hauptcheckout gab 404 fuer
`/atomar/zusagen` — eine Seite, die auf `main` liegt. Der Baum lag **87
Commits zurueck**. Ein 404 sieht aus wie „gibt es nicht" und war „gibt es hier
noch nicht".

**Die Abstammung.** `git merge-base --is-ancestor` sagte fuer neun Commits
„nicht auf `main`". Die Arbeit lag seit einer Stunde dort, unter anderen SHAs,
nach einem Squash-Merge. Daraus wurde ein Auftrag mit Vorrang.

## Warum die beiden verschieden teuer sind

3 Agents Einordnung, und sie ist der Grund, warum das hier eine eigene Regel
ist und kein Absatz:

| | Folge |
|---|---|
| **404** — etwas scheint zu fehlen | jemand baut es **noch einmal** |
| **Abstammung** — fremde Arbeit scheint zu fehlen | jemand erklaert sie fuer **verschwunden** und handelt danach |

Die zweite ist die gefaehrlichere: Sie fuehrt zu Reverts, zu Cherry-Picks aus
fremdem Code, und zu Auftraegen, die die Gefahr erzeugen, vor der sie warnen.

## Der Handgriff

Vor jedem „gibt es nicht", „fehlt", „ist nicht drin", „wurde nie gebaut":

1. **Wo stehe ich?** `git rev-list --count HEAD..origin/main` — nicht `0`,
   dann misst der Baum eine Vergangenheit.
2. **Womit messe ich?** Eine Abstammung beantwortet eine Frage ueber einen
   COMMIT. Fuer eine Frage ueber ARBEIT: `git diff <sha> origin/main -- <pfade>`.
   Leerer Diff heisst: es ist da, unter anderem Namen.
3. **Sieht mein Werkzeug den Gegenstand ueberhaupt?** Ein Typecheck ohne
   `node_modules` meldet 0 Fehler, ein `grep` ohne den richtigen Ordner meldet
   0 Treffer, und beide sehen aus wie eine Antwort.

## Verwandt

[[nie-eine-abwesenheit-zusichern]] sagt, dass eine Abwesenheit veraltet.
Diese Regel sagt das Schaerfere: **Sie war moeglicherweise nie wahr** — nicht
weil sich die Welt geaendert hat, sondern weil der Messplatz falsch stand.

## Die zweite Gestalt: nicht der Platz stand falsch, das VERFAHREN sah den Gegenstand nicht

3 Agent, wenige Stunden nachdem sie den Satz oben formuliert hatte — an ihrem
eigenen Fall:

Sie hatte 13 Stellen gezaehlt, an denen eine Farbe als Schrift steht. Es sind
**14**. Die vierzehnte, `zielgruppen/page.tsx:34`, legt den Wert in eine
**Zustandskarte**, aus der erst Zeile 237 eine Schriftfarbe macht. Der Wert
reist durch eine Variable und faellt aus jeder Suche nach `color: "#…"` heraus.

> **Gezaehlt wurde die SCHREIBWEISE, nicht die VERWENDUNG.**

Und der teurere Teil: Sie hatte im selben Eintrag geschrieben, diese Datei trage
die Farbe *„nur als Rand und Flaeche, nie als Schrift"* — **eine Zusicherung
ueber eine Abwesenheit, gestuetzt auf eine Suche, die diese Art von Verwendung
gar nicht sehen kann.**

### Warum das eine eigene Gestalt ist

| | was falsch stand |
|---|---|
| erste Gestalt | der **Messplatz** — veralteter Baum, falsche Abstammung |
| zweite Gestalt | das **Verfahren** — es kann den Gegenstand nicht erfassen |

**In der Ausgabe sehen beide gleich aus: „nichts gefunden".** Und die zweite ist
schwerer zu bemerken, weil der Messplatz stimmt und man deshalb nicht weitersucht.

### Der zusaetzliche Handgriff

Vor einer Zusicherung ueber eine Abwesenheit: **Nenne einen Fall, den deine
Suche NICHT finden wuerde.** Faellt dir keiner ein, hast du die Suche noch nicht
verstanden — nicht bewiesen, dass es keinen gibt. Ein Wert in einer Variablen,
ein Default-Parameter, eine zusammengesetzte Zeichenkette, ein Aufruf ueber eine
Tabelle: Es gibt fast immer einen.

Dieselbe Familie wie `schreiber-zaehlen-nicht-leser`: Dort versteckte ein
Vorgabewert einen vergessenen Aufrufer. Hier versteckt eine Variable eine
Verwendung. **Beide Male ist der gesuchte Gegenstand da und die Suche blind.**

## Die dritte Gestalt: die PROBE konnte den Fehler nicht zeigen

2 Agent, 06.09.2026, ueber ihre eigene, wenige Stunden zuvor gemergte Arbeit:

Ihre neue Zeichen-Primitive meldet jeden Verstoss als „ragt in den geschuetzten
Bereich". Fuer die Formate **1:1 und 16:9 gibt es dort aber gar keinen
Schutzbereich** — die Zone IST die Leinwand, und die richtige Meldung waere
„passt nicht auf die Leinwand". Zwei verschiedene Saetze, einer davon falsch.

Ihre Einordnung, und sie ist der Grund fuer diesen Abschnitt:

> **Aufgefallen ist es nicht, weil die Sammelkarte 1080x1920 ist, also 9:16 —
> dort fallen beide Lesarten zusammen. Ein Fehler, den das einzige Motiv, an dem
> ich gemessen habe, nicht zeigen KONNTE.**

### Die drei Gestalten nebeneinander

| | was falsch stand |
|---|---|
| erste | der **Messplatz** — veralteter Baum, falsche Abstammung |
| zweite | das **Verfahren** — es kann den Gegenstand nicht erfassen |
| dritte | die **Probe** — sie kann den Fehler nicht zeigen |

Alle drei melden dasselbe: **nichts gefunden.** Und die dritte ist die
freundlichste und darum gefaehrlichste: Messplatz und Verfahren sind in Ordnung,
die Zahl stimmt, das Ergebnis ist echt — es beantwortet nur eine engere Frage,
als es zu beantworten scheint.

### Der Handgriff

**Vor „geprueft": Nenne einen Fall, den deine PROBE nicht zeigen wuerde.** Nicht
deine Suche (das ist die zweite Gestalt), sondern der Gegenstand, an dem du
gemessen hast. Ein Format, ein Empfaenger, ein Theme, eine Streckenlaenge.

Faellt dir keiner ein, hast du **eine** Probe und nennst sie „alle".

Verwandt: [[zu-wenige-seeds]] sagt dasselbe fuer Zahlen — nur der Abstand zum
Ausgangswert traegt. Hier ist es der Abstand zwischen zwei Proben: Wo sie
zusammenfallen, unterscheidet die Messung nichts.

## Wer pruefen will, ob etwas veraltet ist, sucht nach dem ALTEN

3 Agent, 06.09.2026, nachdem D-037 entschieden war und vierzehn Textstellen
nachgezogen werden sollten.

**Es waren nicht vierzehn falsche, sondern eine.** Dreizehn sagten es laengst
richtig. Und **die eine falsche stand nicht auf der Liste**: `i18n.ts:459`, die
englische Preiskachel —

```
de   „14 Tage frei — ab dem Losfahren"
en   „14 free days — from your first FINISHED ride"
```

Zwei Sprachen, zwei verschiedene Zusagen, beide fuer sich lesbar, auf der
oeffentlichen Startseite.

**Ihre Muster fanden sie nicht:** „first finished ride" enthaelt weder „first
ride" noch „clock starts" noch „Uhr startet". Gefunden hat sie erst die Suche
nach dem **alten** Anker.

> **Wer pruefen will, ob etwas veraltet ist, sucht nach dem ALTEN. Die Suche
> nach dem Neuen findet nur, was schon richtig ist.**

Das ist die vierte Gestalt: nicht der Messplatz, nicht das Verfahren, nicht die
Probe — sondern **der Suchbegriff**, der die Gesunden zaehlt statt der Kranken.

## Und eine Liste veraendert beim Weiterreichen ihre Bedeutung

Ihre Liste hiess **„Stellen, die den Anker NENNEN"**. Beim Weiterreichen wurde
daraus **„Stellen, die FALSCH sind"** — beim Verteiler und bei ihr selbst, die
der Formulierung nicht widersprochen hat.

**Blind nachgezogen haette sie dreizehn richtige Texte umgeschrieben.**

Eine Liste traegt ihre Frage nicht mit sich. Wer sie weitergibt, gibt Zeilen
weiter; die Frage bleibt beim Absender. **Also: Beim Weiterreichen die Frage
mitschreiben, und beim Empfangen sie zurueckfragen, bevor gehandelt wird.**

## Zwei Flaechen, zwei Regeln — und wir hatten eine Regel fuer beide

der Betreiber, 06.09.2026, nachdem zwei Tage an der falschen Frage gearbeitet worden
war:

> **„Beim Marketing-Studio ist das anders, da haben wir keinen Rand. Da haben wir
> den Hintergrund, der darf die Karte voll ausfuellen, und der Content muss
> Abstand nach aussen haben, sodass dieser nicht abgeschnitten wird."**

| | Werbemotiv | Sammelkarte |
|---|---|---|
| Der Hintergrund | fuellt die Leinwand **randlos** | ist Flaeche **um** die Karte |
| Der Gegenstand der Pruefung | **jedes Inhaltselement** einzeln | **die Karte als Ganzes** |
| Was nicht abgeschnitten werden darf | der **Text** | der **Rahmen** |

**Beides ist richtig, und es sind verschiedene Regeln.** Wir haben die Regel des
einen auf das andere angewandt: acht Textfelder der Sammelkarte einzeln gegen die
Zone gemessen — und dabei den Rahmen nie geprueft, der das Einzige war, worum es
ging.

### Woran man es beim naechsten Mal frueher merkt

**Frag, was das Bild IST, bevor du misst, was darin liegt.** Eine randlose
Flaeche und ein Objekt auf einer Flaeche sehen als Datei gleich aus — 1080x1920,
beide. Der Unterschied steht in keiner Zahl, die man ueber sie erheben kann.

Und der Satz, der es vorher haette aufdecken koennen, kam von der Betreiber in vier
Worten: **„Wir hatten nie ein Problem mit dem Text, sondern mit dem Rand."** Zwei
Tage Messung ueber den Text.
