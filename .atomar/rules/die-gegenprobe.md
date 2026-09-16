---
name: die-gegenprobe
title: Die Gegenprobe ist nicht optional
origin: operator
rank: 800
version: 1.0.0
short: "Brich absichtlich das, was eine Prüfung halten soll — so, wie es in echt bräche — und sieh, dass sie klagt. Am Exit-Code, nicht an der Zusammenfassung. Eine Prüfung, die nicht scheitern kann, meldet immer bestanden."
---
## Dieselbe Regel steht schon oben

`CLAUDE.md`, Abschnitt **„Prove the check ran"**, sagt sie für Werkzeuge:
ein Werkzeug, das deinen Code nicht sieht, meldet Erfolg — also brich ihn
absichtlich und sieh nach, dass es klagt. Hier gilt sie für die eigenen
Prüfungen. Es ist eine Regel, zweimal angewandt, nicht zwei Regeln.

## Warum

Ein Wächter, der nichts bewacht, sieht genauso aus wie einer, der alles
in Ordnung findet. Es gibt dafür eine Fallsammlung; von den ersten sieben Fällen darin wären
sechs ohne Gegenprobe durchgegangen. (Wo die Sammlung liegt, steht unter
„Material zum Nachschlagen" — falls sie in diesem Projekt liegt.)

## Die drei Fälle, wenn eine Mutation grün bleibt

In dieser Reihenfolge prüfen:

1. **Der Test trifft die Stelle nicht** — den Test schärfen.
2. **Ein Netz fängt die Mutation auf** (ein Rückfall, ein Standardwert,
   ein `??`, ein `try`) — dann das Netz brechen, nicht die Rechnung.
3. **Die Eigenschaft ist im Testlauf nicht beobachtbar** — dann, und nur
   dann, den Wächter entfernen und die Lücke im Code benennen.

Die dritte ist die seltenste. Wer sie zu früh wählt, hat aufgegeben.

## Und die Gegenprobe gehört an JEDE Stelle

Nicht an die, die man ohnehin geändert hat. Das beweist, dass der
Wächter DIESE Zeile sieht — nicht, dass er die Bauform sieht.

## Bei der Gegenprobe zählt der NAME, nicht die Anzahl

3 Agent, 05.09.2026: Vier Rückbauten meldeten viermal **„3 rote Tests"** —
dieselbe Zahl, was nach einem Übersetzungsfehler aussah statt nach vier
verschiedenen Treffern. Erst die Namen zeigten, dass es vier verschiedene
Fälle waren: „der Versand weist sie ab" gegen „sie ist nur Text".

Ihr eigener Nachsatz ist die Regel:

> *„Was mich stutzig gemacht hat, war nicht Sorgfalt, sondern dass viermal
> dieselbe Zahl herauskam. Wären es 2, 3, 1, 4 gewesen, hätte ich sie
> geglaubt."*

Eine Anzahl sagt nicht, **worüber** sie spricht. Vier Rückbauten, die
zufällig dieselbe Zahl treffen, sehen aus wie ein Fehler — vier, die
verschiedene Zahlen treffen, sehen aus wie ein Beleg. Beides ist keine
Aussage. Lies die Namen der gefallenen Tests, immer, auch wenn die Zahlen
unauffällig sind.

Verwandt: dieselbe Familie wie eine Zahl, die aus **zwei Blöcken**
zusammengesetzt ist und trotzdem wie eine gemessene aussieht.

## Der Scheinbeweis: rot aus dem falschen Grund

6 Agent, 05.09.2026. Zwei Mutationen erzeugten Code, **der nicht parst** —
ihr Muster traf nach einer Umstellung nur die erste Zeile eines
zweizeiligen Aufrufs, die zweite blieb verwaist stehen. Die Suite wurde
rot.

**Eine solche Mutation wäre auch dann rot, wenn die Regel völlig
unbewacht wäre.** Sie beweist nichts und sieht dabei aus wie ein Beweis.

Die Werkbank prüft deshalb nach jeder Mutation, ob die Datei noch parst,
und meldet **UNPARSEABLE** statt „bewiesen". Das ist der Wächter des
Wächters — dieselbe Form, die das Werkzeug sonst fängt, eine Ebene höher.

## Eine Absicherung, die eine Prüfung aufhebt, sichert nichts

Am selben Tag: `urheber()` hatte **drei** Ersetzungen, wo zwei reichen.
Die dritte stand „zur Sicherheit" da — und machte die Gegenprobe
**wirkungslos**: Nahm man eine weg, sprang die andere ein, und die
Mutation blieb grün.

Redundanz, die man für Robustheit hält, ist für eine Mutationsprüfung ein
Netz, das jeden Fehler auffängt — auch den, den man gerade nachweisen
will. Wer eine Stelle doppelt absichert, muss wissen, dass er sie damit
der Prüfung entzieht.

## Und die eigene Messung ist auch nur eine Messung

Ihre erste Auswertung meldete **fünf** solcher Fälle. Sie las die
Zeichenketten aus dem Quelltext und verwandelte dabei `\n` in einen
echten Zeilenumbruch — **drei der fünf waren Artefakte der Auswertung
selbst**. Gemerkt hat sie es, weil ihr die Zahl zu groß vorkam und sie
einen Fall von Hand nachgesehen hat.

Die Prüfung gehört dorthin, wo die echten Werte liegen, nicht in ein
Skript daneben.

## Ein Wächter, den man nicht schreiben kann, sagt etwas über den Code

6 Agent, 05.09.2026: Der Rumpf einer erzeugten Aufgabe enthielt
**wörtliche** Backslash-n statt Umbrüchen. Der Test war grün — er suchte
den **Text** und sagte nichts über seine **Form**.

Gefunden hat sie es nicht durch den Test, sondern beim **Versuch, einen
Wächter dafür zu schreiben**: Das Suchmuster traf null Mal. Diese Null war
die Frage, die den Fehler aufdeckte.

Wer ein Muster nicht zum Greifen bringt, hat oft nicht das Muster falsch,
sondern eine falsche Annahme über den Code.

## Die Testzahl lesen, nicht die Fehlerzahl

Am selben Tag: Ein Testentwurf importierte `cli.mjs`, um an eine Vorlage
zu kommen — und **führte damit die Kommandozeile aus**. Dabei verschwanden
**30 von 309 Tests**, und der Lauf meldete **Exit 0**.

`0 failed` und `0 collected` sehen in einer Zusammenfassung gleich aus.
Aufgefallen ist es nur, weil sie die **Anzahl** gelesen hat und nicht die
Fehlerzahl.

Nach jedem Lauf: Ist die Zahl der gelaufenen Tests die, die man erwartet?
Eine gesunkene Zahl bei grünem Ergebnis ist der gefährlichste aller
Befunde, weil er wie Erfolg aussieht.

## Eine Verengung, die Rauschen abstellt, stellt leicht auch Signal ab

3 Agent, 05.09.2026. Am Morgen hatte sie einen Wächter **verengt**, um
Fehlalarme aus einer Admin-Spalte loszuwerden: Er erkannte die Zusage nur
noch mit der **Ziffer** „14 Tage".

Zwölf Stunden später fand jemand eine vierte Umschreibung derselben Zusage
in der deutschen Mail. Sie schreibt „**vierzehn**" aus. Die Gegenprobe zum
neuen Wächter blieb deshalb **grün**, obwohl der Fehler zurückgebaut war —
die Verengung vom Morgen hatte genau den Fall ausgeblendet, der am Abend
der wichtige war.

> Eine Verengung, die Rauschen abstellt, stellt leicht auch Signal ab. Und
> das merkt man nur, wenn die Gegenprobe die **andere Schreibweise**
> kennt.

Gefunden hat es nicht der Wächter, sondern **seine eigene Gegenprobe** —
sie wurde nicht rot, wo sie es hätte werden müssen. Deshalb ist die
Gegenprobe nicht Beiwerk: Sie ist die einzige Stelle, an der ein Wächter
über sich selbst etwas sagen kann.

## Wer unversionierte Arbeit einsammelt, kauft ihre Fehler mit ein

05.09.2026. Eine Testdatei vom 28.08. lag unversioniert im Hauptcheckout. Sie
wurde — richtigerweise — gesichert statt liegengelassen. Danach war `main`
typcheck-**rot**: Sie importierte zwei Exporte, die es in der Zwischenzeit
nicht mehr gab.

**Der Test war schon tot, als er gefunden wurde.** Er ist nicht durch das
Sichern kaputtgegangen. Solange er unversioniert danebenlag, hat ihn **niemand
geprueft** — ins Repo gelegt wird er geprueft und faellt.

Daraus folgt der Satz, der ueber diesen Fall hinausgeht:

> **Unversionierte Arbeit ist nicht nur ungeschuetzt, sie ist auch
> ungeprueft.**

Und deshalb: **Wer sie einsammelt, kauft ihre Fehler mit ein — alle auf
einmal.** Das Sichern bleibt richtig; was fehlt, ist der Schritt danach.

## Die Regel

Nach jedem Einsammeln unversionierter Arbeit wird **einmal geprueft, was man
hereingeholt hat**. Bei einer Datei ist das ein Typecheck, bei dreissig ein
Lauf. Vorher gilt der Stand nicht als sauber, egal wie sorgfaeltig das
Einsammeln war.

Am selben Tag wurden **88 Dateien** aus dem Hauptcheckout gerettet. Dass davon
nur eine gebrochen war, ist Glueck und kein Verfahren.

## Und ein Archiv ist kein Ablageort, sondern eine Zusage

`archive/` lag innerhalb der tsconfig-Reichweite. Ein Archiv, das
mitkompiliert wird, ist keines — es ist ein Ordner mit einem beruhigenden
Namen. Wer etwas archiviert, sorgt dafuer, dass es **aufbewahrt und nicht
gepflegt** wird; beides muss im Werkzeug stehen, nicht nur in der Absicht.

## Eine Schleife, die einen Fehlschlag nicht liest, meldet Erfolg für nichts

2 Agent, 05.09.2026, beim Auflösen eines Rebase-Konflikts. Die Schleife sah
richtig aus und lief fünfmal:

```bash
for i in 1 2 3 4 5; do
  u=$(git diff --name-only --diff-filter=U)
  [ -z "$u" ] && break
  loese                      # meldet: „2 Dateien zusammengeführt"
  git add $u                 # ← scheitert, unbemerkt
  git rebase --continue
done
```

Fünf Durchläufe, fünfmal *„Logzeilen zusammengeführt"*, **null Wirkung**. Der
Grund: `$u` enthielt zwei Dateinamen, getrennt durch einen Zeilenumbruch,
unquotiert — `git add` bekam einen einzigen Pfad mit einem `\n` darin und wies
ihn ab. Niemand las den Rückgabewert, also lief die nächste Runde auf demselben
Konflikt und meldete denselben Erfolg.

**Das ist die Form, nicht der Einzelfall.** Am selben Abend fünfmal dieselbe
Familie, jedes Mal woanders: ein Deploy auf `BLOCKED`, der wie ein Erfolg
aussah; `exited with code 0` über sechs roten Tests; ein Knopf ohne Workflow
dahinter; ein Freigabe-Feld, das die Regel verlangte und das Werkzeug abwies;
und diese Schleife. **Etwas, das Erfolg meldet und nichts tut.**

### Was die Gegenprobe hier war

Nicht der Rückgabewert — der wurde ja nicht gelesen —, sondern das **Ergebnis
nachzählen**: Fehlt nach dem Zusammenführen eine Zeile aus `origin/main`? Sind
die eigenen drin?

```bash
comm -23 <(git show origin/main:$f | grep '^- 2026' | sort) \
         <(grep '^- 2026' $f | sort) | wc -l     # muss 0 sein
```

Null fehlende Zeilen aus `main`, 17 statt 8 im Ergebnis — erst das ist die
Aussage. Ohne sie wären es fünf Erfolgsmeldungen und ein leeres Ergebnis
gewesen.

### Die Lehre

- **Eine Schleife, deren Schritt fehlschlagen kann, muss den Fehlschlag
  lesen** — `set -e`, ein `||` mit Abbruch, oder eine Zählung hinterher.
- **Und eine, die fünfmal dasselbe tut, hat beim ersten Mal nichts getan.**
  Wiederholung ohne Fortschritt ist selbst der Befund; wer sie sieht, hat den
  Fehler schon vor sich.

## Ein Wächter, der Text sucht, findet zuerst seine eigene Erklärung

05.09.2026, zweimal in derselben Sache innerhalb einer Stunde.

**Erster Anlauf.** Ein Wachtposten auf eine Freigabe prüfte, ob ein `answer:`
im Eintrag steht. Er meldete „Antwort da" über einer Freigabe, die keine war —
die Anwesenheit statt des Urhebers, genau das, was
[[freigabe-holt-man-sich-selbst]] im selben Absatz verbietet.

**Zweiter Anlauf, und der ist der lehrreiche.** Die Reparatur suchte den
Urheber: `· der Betreiber · answered:`. Sechs Minuten später schlug sie an — auf die
Log-Zeile, in der erklärt wurde, wonach sie suchen soll.

> **Ein Wächter, der auf seine eigene Beschreibung anschlägt.**
> Er hielt seinen Bauplan für den Gegenstand.

Beide Male hätte er die Freigabe erteilt, die er bewachen sollte. Beide Male
sah er aus wie eine Verbesserung.

### Warum das kein Einzelfall ist

Ein Textmuster hängt nicht nur an Trenner, Wort und Schreibweise. Es hängt
daran, **dass der gesuchte Text nur dort vorkommt, wo er etwas bedeutet** — und
in einem Verlauf, in dem über Muster geschrieben wird, gilt das nie.

Ein Backlog-Eintrag ist deshalb der denkbar schlechteste Ort für eine
Textsuche: Er ist genau das Medium, in dem über die gesuchten Dinge geschrieben
wird. **Je sorgfältiger jemand die Sache dokumentiert, desto sicherer findet
der Wächter die Dokumentation.**

Und: *„Ein Rezept, das seine eigene Erklärung trifft, verbreitet sich schneller
als der Fehler, den es verhindern soll."* Das falsche Muster war in einer
Stunde in vier Sitzungen und in dieser Regelsammlung.

### Die zwei Reparaturen — und dass sie NICHT dieselbe ist

**Verankern.** Der Urheber ist das zweite Feld einer Zeile, nicht Text
irgendwo darin:

| | D-025/026/030/032 | D-035 (nachgetragen) |
|---|---|---|
| `· der Betreiber · answered:` | 1 | **1** ← trifft die Erklärung |
| `^- <Zeitstempel> · der Betreiber · answered:` | 1 | **0** |

Nur die verankerte Suche unterscheidet. Und der Beleg dafür ist erst
vollständig, wenn ein Eintrag dabei ist, den das schwache Muster fängt und das
starke nicht — sonst zeigt die Gegenprobe nur, dass das neue Muster nicht zu
eng ist.

**Kommentare abstreifen — aber nur manchmal.** Am selben Tag war es an drei
Stellen richtig und an einer falsch, und der Unterschied liegt im GEGENSTAND:

- Ein Kommentar über eine **tote Farbe** ist nie eine tote Farbe. Abstreifen.
- Ein Kommentar über eine **alte Zusage** ist manchmal die alte Zusage. Zwei
  der vier Stellen, die der Zusagen-Wächter fand, waren genau das: Kommentare,
  die die überholte Regel als geltend beschrieben.

> **Es hängt am Gegenstand, nicht am Werkzeug.**
> Ein Wächter, der Geschichte durchlässt, lässt auch Behauptungen durch.

Einzeln ist jede Hälfte die Anleitung zum jeweils anderen Fehler.

### Eine Grenze benennen ist auch eine Entscheidung

Der Zusagen-Wächter wird rot, wenn jemand die alte Zusage in einem Kommentar
zitiert — auch als Geschichte, auch korrekt gekennzeichnet. Das ist bewusst
nicht repariert worden. Wer darüber stolpert, soll im Eintrag lesen, dass es
Absicht war, und dann entscheiden: die Erklärung anders formulieren, oder den
Wächter ändern und den Preis dafür kennen.

**Unbequem und ehrlich schlägt bequem und blind.**

## Ein Helfer, der die gepruefte Sache bequem macht, macht die Pruefung wirkungslos

6 Agent, 05.09.2026, nach dem ersten vollstaendigen Werkbank-Lauf: **184 von
188 Waechtern bewiesen, VIER still gruen** — sie bewachten nichts.

Bei zweien war die Ursache ihr eigener Testhelfer. `mitAbdruck` haengte allen
gesperrten Befehlen den Regel-Abdruck automatisch an, **damit die Tests den
echten Weg gehen**. Er ging ihn so gruendlich, dass **das Entfernen der Sperre
gar nichts aenderte** — der Helfer erfuellte die Bedingung, die geprueft werden
sollte.

> **Ein Helfer, der die gepruefte Sache bequem macht, macht die Pruefung dabei
> wirkungslos.**

Es ist dieselbe Familie wie „zwei Netze fangen dieselbe Mutation" — nur ist das
zweite Netz hier **der Testaufbau selbst**. Und die Absicht war richtig: Der
Helfer war gebaut, damit die Tests **nicht** am echten Weg vorbeilaufen.

### Die anderen zwei waren zu schwache Zusicherungen

- Der Test prueft, **DASS** Platte und Bestand abweichen — und sagt nichts
  darueber, **WELCHER** Wert dann gilt.
- Und er **aendert** eine Regel, statt eine zu **entfernen** — nur beim
  Entfernen entsteht die Meldung, die er bewachen soll.

Beides sieht beim Lesen wie eine Pruefung aus. Beides faellt nie.

### Die Zahl, die zaehlt

**Jeder fuenfte selbst gebaute Waechter hat beim ersten Anlauf nichts
bewacht.** Zehn von rund fuenfzig an einem Tag, gefunden von einem Werkzeug,
das jede Zusicherung einzeln bricht und nachsieht, ob sie faellt.

**Ohne diese Messung waeren „51 neue Waechter" gemeldet worden** — mit vier
darunter, die nichts tun. Eine Zahl von Waechtern ist deshalb keine Aussage
ueber Sicherheit, solange nicht jeder einzeln gebrochen wurde.


## Ein Werkzeug, das seine eigene Frage nicht beantworten kann

Dreimal in einer Nacht, 06.09.2026, von drei verschiedenen Sitzungen — und
jedes Mal sah das Werkzeug **funktionierend** aus:

| | was es getan haette |
|---|---|
| **Die zweisprachige Ansicht** (3 Agent) | zweimal dieselbe Spalte holen; fuer eine Mail mit `sprachwahl: empfaenger` waeren beide Haelften identisch gewesen — **ein Unterschied, den sie bauartbedingt nie zeigen kann** |
| **Zwei Kartenfassungen** (2 Agent) | keine Zonenverstoesse, also gruen — sie erzeugten stattdessen je zwei **Ueberschneidungen**, die die Pruefung nicht ansah |
| **Die Zusagen-Warnung ueber Mailtexte** (3 Agent) | das Merkmal aus den Inhaltswoertern der Zusage ableiten; an zwoelf Proben gemessen fing sie **keine** der vier alten Fassungen |

## Warum diese Fehlerart die teuerste ist

Ein kaputtes Werkzeug faellt auf. Ein Werkzeug, das die falsche Frage
beantwortet, **beruhigt** — und je laenger es gruen dasteht, desto sicherer ist
man sich. Es wird also nicht nur nicht bemerkt, es baut Vertrauen auf.

3 Agents Satz dazu, nachdem ihre erste Fassung durchgefallen war:

> **Sie haette in jedem Test gut ausgesehen, den ich mir ausgedacht haette — nur
> nicht in dem einen Fall, fuer den es sie gibt.**

Das ist der Kern: **Selbst ausgedachte Proben stammen aus demselben Kopf wie das
Werkzeug** und teilen seine blinden Flecken. Ihre erste Fassung war die
*elegantere* Idee (das Merkmal aendert sich mit der Zusage mit) — Eleganz ist
hier kein Indiz, sondern das Warnzeichen.

## Der Handgriff

**Miss das Werkzeug an ECHTEN alten Faellen, nicht an erdachten neuen.** Vier
Fassungen, die es haette fangen muessen, und ein paar harmlose Saetze, die es
nicht melden darf. Beides zusammen, in einem Lauf, mit Zahlen:

```
nur Woerter, Schwelle 3   faengt KEINE der vier alten Fassungen
nur Woerter, Schwelle 2   faengt zwei — und meldet einen harmlosen Satz
die DAUER                 faengt alle vier, meldet keinen harmlosen Satz
```

Ohne diese Tabelle waere die erste Fassung eingecheckt worden.

### Und: ein Waechter darf nicht an der Erklaerung seines Nachbarn haengenbleiben

Ihr eigener Kommentar loeste den Zusagen-Waechter aus, weil er den alten
Wortlaut zitierte. **Die Loesung ist der umformulierte Satz, nicht eine
Ausnahmeliste** — eine Ausnahmeliste waechst, und jeder Eintrag darin ist eine
Stelle, an der der Waechter absichtlich blind ist. Dasselbe Muster wie das freie
Suchmuster, das die Regel trifft, die es erklaert.

## Die Gegenprobe, die NICHT feuert, sagt mehr als die, die feuert

2 Agent, 06.09.2026. Sie wollte pruefen, ob ihre neue Sperre wirklich sperrt,
und hat den Bruch **zweimal** eingebaut — einmal je Format:

```
1:1   30-%-Schutzbereich unten eingefuegt   56 → 56   TEST GRUEN
9:16  derselbe Eingriff                     56 → 69   rot, wie erwartet
```

**Die 1:1-Probe hat nicht gefeuert, und genau das war der Befund.** Der Grund:
`meldeVerstoesse` verdrahtet `aspect === "9:16"` fest und liest die Zonentabelle
fuer 1:1 gar nicht aus. Zwei Buchfuehrungen ueber dieselbe Sache, und sie
widersprechen sich bereits heute.

Ihr Satz dazu:

> **Haette ich nur die 9:16-Probe gemacht, haette ich „Sperre geprueft" gemeldet
> und den blinden Fleck mit eingebaut.**

### Warum das die Gegenprobe der Gegenprobe ist

Eine Gegenprobe, die feuert, beweist: *Der Waechter kann rot werden.* Sie
beweist **nicht**, dass er es an jeder Stelle kann, an der er es sollte. Wer nur
dort bricht, wo der Waechter ohnehin hinsieht, misst seine eigene Erwartung.

Deshalb: **Den Bruch dort einbauen, wo man am wenigsten mit einer Reaktion
rechnet** — im zweiten Format, in der anderen Sprache, im leeren Fall. Bleibt es
still, ist das kein Beweis der Ruhe, sondern die Fundstelle.

Das ist zugleich die dritte Gestalt aus
[[ein-negativer-befund-misst-den-messplatz]] von innen: Wer nur eine Probe
bricht, hat eine Probe und nennt sie „alle".

### Und eine Obergrenze ist keine Zusicherung

Derselbe Test haelt **56 als Obergrenze, die nur fallen darf** — plus die sechs
sauberen Faelle **namentlich**. Ihr Grund: Eine Obergrenze allein merkt nicht,
wenn ein gruener Fall rot wird und ein roter zugleich gruen. **Die Summe bliebe
gleich.**

## Ein Vergleich ohne Mengenangabe kann nicht scheitern

2 Agent, 06.09.2026. Sie hat alle 40 Motive in drei Formaten gegen `origin/main`
gerendert und die Pruefsummen verglichen — der einzige Weg, eine Aenderung an 66
Argumentlisten zu belegen, denn *„tsc gruen" sagt darueber nichts.*

**Beim ersten Lauf meldete der Vergleich „keine Unterschiede". Beide Seiten
waren leer.** Das Skript lag in `/tmp` und fand `@napi-rs/canvas` nicht; `diff`
verglich pflichtgemaess nichts mit nichts.

Aufgefallen ist es an der **Zeilenzahl**, die sie danebengeschrieben hatte:

```
0 / 0        ← das war es
40 / 40      ← so sieht dasselbe „keine Unterschiede" aus, wenn es etwas heisst
```

> **In einem `diff` sehen 0 gegen 0 und 40 gegen 40 identisch aus.**

Dieselbe Familie wie „0 collected" neben „0 failed" — nur an einem Werkzeug,
das sie sich fuenf Minuten vorher selbst gebaut hatte. **Ein frisch gebautes
Werkzeug hat noch keinen Ruf zu verlieren und wird trotzdem geglaubt.**

### Also

Jeder Vergleich, jede Zaehlung, jeder Abgleich nennt **die Menge, ueber die er
gelaufen ist**, und bricht ab, wenn sie kleiner ist als erwartet. Nicht „keine
Unterschiede", sondern „keine Unterschiede in 40 von 40".

Die Gegenprobe dazu war ein einziges verschobenes Pixel in einem Motiv — der
Vergleich nannte genau diese Zeile.

## Eine schwer messbare Zusicherung sagt etwas ueber den ORT, nicht ueber den Test

6 Agent, 06.09.2026, beim letzten von 206 Waechtern. Er blieb still gruen, und
der Grund war strukturell: Die Zusicherung lag in `cli.mjs` und haette **einen
laufenden Dienst UND einen Kindprozess** gebraucht — die erreichen sich hier
nicht.

**Die Loesung war kein weiterer Test. Sie war eine Verschiebung.** Die Sperre
liegt jetzt in `regelstand.mjs` neben dem Fingerabdruck und nimmt die
Dienstadresse als **Angabe** entgegen. Damit ist sie im selben Prozess pruefbar,
und die Mutation macht den Lauf rot.

> **Dass eine Zusicherung schwer zu schreiben ist, sagt oft etwas ueber den Ort,
> nicht ueber den Test.**

### Warum das die wichtigste der vier Ausformungen ist

„Der Test prueft die Funktion, niemand prueft die Verbindung" ist heute Nacht
**viermal** aufgetreten. Dreimal hiess die Antwort „noch ein Test". **Beim
vierten Mal hiess sie: die Sache an eine Stelle legen, an der man sie messen
kann.**

Der Unterschied ist dauerhaft. Ein zusaetzlicher Test an einer schlecht
gelegenen Sache haelt genau so lange, wie ihn niemand verschiebt. Eine Sache,
die an einer messbaren Stelle liegt, bleibt messbar.

### Der Handgriff

Wenn eine Zusicherung sich nicht schreiben laesst, ohne zwei Prozesse, ein Netz
oder einen Zufall zu brauchen: **nicht den Test groesser machen, sondern fragen,
warum die Sache dort liegt.** Meistens ist sie in eine Schicht geraten, die sie
nicht braucht — und eine Ebene tiefer ist sie eine reine Funktion mit einer
Angabe.

## Eine Vorschau, die ihre eigene Voraussetzung mitbringt, bestaetigt sie

3 Agent, 06.09.2026, ueber ihr eigenes Werkzeug. Ihre Rendervorlage legte den
**weissen Grund selbst darunter**, mit der ausdruecklichen Begruendung
*„Postfaecher zeigen hell"*.

Genau diese Annahme war der Fehler — und weil sie als **Absicht** im Code stand,
sah sie geprueft aus. Die Mail selbst brachte keinen Grund mit: `#1a1a1a` auf
einem dunklen Postfach ergibt **1,01:1**.

> **Ein Werkzeug, das die Bedingung herstellt, unter der die Sache funktioniert,
> kann nicht mehr zeigen, dass sie ohne diese Bedingung nicht funktioniert.**

Die Vorschau zeigt jetzt **jede Mail zweimal**, auf weissem und auf dunklem
Grund.

### Und der zweite Fehler brauchte die dunkle Seite gar nicht

Beim Nachrechnen fiel ein zweiter auf: Die Linkfarbe `#0a7` hatte **auf Weiss
nur 2,99:1** — unter der Schwelle, seit der ersten Probe, **im richtigen hellen
Fall.** Vier Messungen (Zeichen, Links, Bilder, Tabellen) hatten ihn nie
beruehrt.

**Der unangenehmere von beiden ist der zweite:** Er stand die ganze Zeit im
hellen Postfach und wurde nur nie gemessen, weil niemand nach dieser Eigenschaft
gefragt hat.

### Der Waechter rechnet, statt zu vergleichen

Er prueft **den Kontrast**, nicht die Schreibweise der Farbe: Wer morgen einen
anderen Ton waehlt, bekommt kein Rot; wer den Grund weglaesst, schon. Und er
laesst den **alten** Zustand durchfallen (1,01 und 2,99) — sonst waere er eine
Beschreibung und keine Pruefung.

## Eine Schutzmassnahme, die den Gegenstand VERSCHIEBT, kann ihn kaputtmachen

2 Agent, 06.09.2026, nach der Frage „warum meldet die Pruefung 0, wo drei Zeilen
uebereinanderliegen".

**Die Sicherheitszonen-Arbeit selbst hat das Layout zerstoert, das sie schuetzen
sollte.** Sie klemmte die Fusszeile nach oben gegen die Zone:

```
ohne Klemmung   fy2 = 1826,9   Fusszeile y 1779…1803   keine Kollision
mit  Klemmung   fy2 = 1521,4   Fusszeile y 1473…1497   KOLLISION
                               306 px nach oben, mitten in den
                               Hintergrund der vierten Statszeile
```

Und sie **konnte es nicht merken**: Sie prueft Text gegen **Zone** und nie Text
gegen **Kasten**.

> **Wer etwas verschiebt, um es zu schuetzen, muss pruefen, wo es LANDET — nicht
> nur, dass es die Grenze einhaelt.**

### Und die Pruefung war blind fuer den halben Gegenstand

Angemeldet waren **15 Flaechen, alle Text**. Nicht angemeldet:

- die vier **Zeilenhintergruende** der Statszeilen
- die **Wortmarke**, weil sie ueber einen anderen Zeichner laeuft

Der sichtbare Zusammenstoss ist genau einer von diesen: Ein Zeilenhintergrund
liegt 24 px ueber der Fusszeile und verschluckt sie optisch. **Die Texte selbst
liegen 1 bis 4 px auseinander** — die Pruefung meldet also korrekt „0" und misst
dabei die falsche Menge.

**Was sie ausdruecklich AUSGESCHLOSSEN hat**, statt es zu vermuten: dass das
Kastenmodell zu eng sei. An echten Schriftmassen nachgemessen ist es
**groesser** als die Glyphen. Eine naheliegende Erklaerung, die falsch gewesen
waere.

### Der Massstab, den keine Messung liefert

der Betreiber, zur richtigen Fassung: **„Es muss eben immer noch nach einer Karte
aussehen — und das tut es."**

Das ist die Abnahme. Keine Zahl in diesem Abschnitt haette sie ersetzt, und die
Zahlen, die wir hatten, standen alle auf Gruen, waehrend es nicht mehr nach
einer Karte aussah.

## Eine Ausnahme gehoert an die ZUGEHOERIGKEIT, nicht an die Lage

2 Agent, 06.09.2026, ueber ihre eigene Ausnahme von wenigen Stunden zuvor.

Sie hatte gebaut: **„Was ganz in etwas anderem liegt, ist keine
Ueberschneidung"** — eine Pille darf ihre Aufschrift umschliessen. Geometrisch
richtig, und deshalb blieb die Zahl nach dem Anmelden von fuenf weiteren
Flaechen bei **0**: Der Zeilenhintergrund umschliesst die **fremde** Fusszeile
ebenfalls vollstaendig.

**Richtig ist die Zugehoerigkeit, nicht die Lage:**

```
stat 4  umschliesst  stat 4 name      -> harmlos, es ist seine Aufschrift
stat 4  umschliesst  seriennummer     -> MELDUNG, sie gehoert ihm nicht
```

Nach der Korrektur: **15 Flaechen → 20, Ueberschneidungen 0 → 3** — genau die
drei, die auf dem Bild uebereinanderliegen.

### Der Teil, der ueber den Fall hinausgeht

Sie hatte diese Ausnahme **in derselben Nacht** aus einem Flag herausgeloest,
das zwei Dinge zugleich bedeutete — und dabei eine neue, kleinere gebaut, die
denselben Fehler hatte. **Sie hielt wenige Stunden und versteckte in dieser Zeit
genau den Fehler, um dessentwillen sie gebaut worden war.**

> **Eine Ausnahme, die aus einer Eigenschaft des ORTES abgeleitet ist statt aus
> der BEDEUTUNG, trifft irgendwann den Fall, fuer den sie nicht gedacht war —
> und schweigt.**

### Und alte Zahlen, die mit ihr gemessen wurden, gelten nicht mehr

Die vier Kartenfassungen waren mit der zu weiten Ausnahme gemessen; „2" und „3"
Ueberschneidungen waren eher zu **niedrig**. **Sie hat es selbst gesagt, obwohl
es folgenlos war** — damit niemand die Zahlen spaeter als gemessen zitiert.

Die Werbemotive sind nicht betroffen und **das ist nachgerechnet, nicht
angenommen**: Dort gibt es keine Kastenformen, die fremde Texte umschliessen;
die 88 stehen unveraendert.

## Eine Sperre, deren Eingabe der Fehler selbst erzeugt, kann nicht ausloesen

**07.09.2026, gemessen.** `scripts/run-tests.mjs` hatte eine Bodenpruefung —
ausdruecklich gegen den Fall „nichts gelaufen", weil `0 failed` und
`0 collected` von aussen gleich aussehen:

```js
if (tests < chosen.length) { … "something loaded without registering anything" }
```

**Sie hat den Fall nicht gefangen, und die Rechnung zeigt genau warum.** Zehn
Dateien luden nie, weil ein Workspace-Paket im Wegwerf-Baum nicht aufloesbar
war. Der Laeufer meldete jeden Fehlschlag **als Test**:

```
gemeldet   6403 = 6393 echte + 10 Ladefehler
wirklich   6492 = 6393 echte + 99, die nie liefen
```

**Die Bodenpruefung blieb die ganze Zeit erfuellt — der Fehler hat die Zahl
gefuettert, die gegen ihn schuetzen sollte.**

## Die allgemeine Form

> **Eine Sperre, deren Eingabe von dem erzeugt wird, wogegen sie schuetzt,
> kann nicht ausloesen.**

Sie ist damit keine schlechte Sperre, sondern **gar keine** — und sie ist
schlimmer als ihr Fehlen, weil sie den Platz besetzt.

**Dasselbe am selben Tag, ein zweites Mal:** Der Antwort-Wachtposten prueft,
ob sein Muster mindestens drei Eintraege trifft. Es traf 33 — alle im ALTEN
Format. Dreizehn standen laengst im neuen, und vier Antworten des Betreibers
fielen durch. **Eine Pruefung, die nur Altbestand misst, kann eine
Formataenderung nicht bemerken.**

## Woran man sie erkennt, bevor sie versagt

- **Woher kommt die Zahl, die die Sperre liest?** Wenn sie aus demselben Lauf
  stammt, den sie beurteilt, ist sie verdaechtig.
- **Kann der Fehlerfall die Eingabe erhoehen?** Ein Ladefehler, der als Test
  zaehlt; ein Altbestand, der den Musterzaehler fuellt.
- **Der Ausweg ist fast immer derselbe: VOR den Lauf statt aus seinem
  Ergebnis.** Die neue Pruefung fragt `require.resolve`, bevor irgendetwas
  laeuft — deshalb wirkt sie, nicht weil der Boden hoeher liegt.
- Und die Gegenprobe dazu bleibt Pflicht: die Sperre **abschalten** und sehen,
  ob die Pruefung rot wird. Wird sie es nicht, hat man zwei Sperren, die beide
  nichts tun.

## Und ein Wächter, der neben der Straße steht, hält niemanden an

**07.09.2026, und die Gegenprobe hat den eigenen Test widerlegt.** Gebaut war
ein Ausschluss: Ein gekennzeichnetes Element darf nicht in den Bildabzug
geraten. Dazu drei Prüfungen, alle grün.

**Dann wurde die Entfernung aus dem Abzug herausgenommen — und es fiel kein
einziger Test um.** Die Prüfungen riefen die Funktion **direkt** auf, nicht
den Weg, auf dem sie im Betrieb liegt. Sie bewiesen, dass die Funktion tut,
was sie tut. Über den Abzug sagten sie nichts.

> **Eine Prüfung, die den Baustein ruft statt den Weg, prüft den Baustein.**

Behoben, indem die drei Schritte des Abzugs **eine** Funktion wurden, die der
Test aufruft. Danach trägt die Gegenprobe: Entfernung heraus → 8/9. Baustein
ohne Kennzeichen → 7/8. Zone abgeschrieben → 7/8. Wie gebaut → 9/9.

**Das ist die Schwester der Sperre oben.** Beide können nicht auslösen — die
eine, weil der Fehler ihre Eingabe erzeugt; die andere, weil sie nicht auf
dem Weg liegt, den der Fehler nimmt.

**How to apply:**
- Nach jedem neuen Test die Frage: **Ruft er den WEG oder den BAUSTEIN?**
  Wenn den Baustein — was passiert, wenn jemand den Aufruf im Weg entfernt?
- Die Gegenprobe gehört an die Stelle, an der der Fehler entstünde, nicht an
  die, an der er sichtbar wäre.
- Und wenn ein Weg aus drei Schritten besteht, von denen einer die Sperre
  ist: die drei zu **einer** Funktion machen, damit der Test sie zusammen
  bekommt. Sonst prüft man einen Schritt und verlässt sich auf zwei.

## Eine Vorgabe ist eine Behauptung, die niemand geprüft hat

2 Agent, 08.09.2026, nach drei Entscheidungen in Folge:

> Dreimal habe ich heute eine Vorgabe so gewählt, dass sie **nichts
> behauptet**: `neutral` als Spaltenvorgabe, „kein Typ" als gültiges Ergebnis,
> die Pionier-Zeile statt einer absoluten Zahl. Jedes Mal war die bequeme
> Alternative eine, die etwas **erfindet** — eine Seite per Münzwurf, ein
> Purist nach einer Frage, „67 Prozent" bei drei Stimmen.

Der Zusammenhang zur Gegenprobe: Eine erfundene Vorgabe ist genau der Befund,
den niemand mehr hinterfragt, weil er wie ein Zustand aussieht und nicht wie
eine Annahme. Sie wird nie rot. Sie wird nur irgendwann zitiert.

**How to apply:**
- Bei jeder neuen Spalte, jedem neuen Parameter, jedem neuen Anzeigewert
  fragen: **Kann die Vorgabe falsch sein?** Wenn ja, muss sie leer sein dürfen —
  `neutral`, `null`, „noch nichts".
- Ein leerer Wert braucht dann eine Anzeige, die ihn gut aussehen lässt. Das ist
  die eigentliche Arbeit, nicht der Wert.
- Und die Gegenprobe dazu: **den leeren Fall zuerst ansehen**, nicht den vollen.
  Wer nur den Fall mit Daten prüft, hat die Vorgabe nie gesehen.

## Und ob sie am RICHTIGEN scheitert

2 Agent, 08.09.2026, nach drei Fehlversuchen an einer einzigen Prüfung:

> Dreimal war heute eine meiner Prüfungen aus dem **falschen Grund** rot. Das
> Fernziel war nicht blank. `parse()` gibt `data` zurück statt `entry`. Und die
> Ränge brauchten die Lücke nicht auf, sodass die Massenoperation gar nicht
> lief — der Test behauptete, sie habe einen Status überfahren, während sie nie
> stattgefunden hatte.
>
> Jedes Mal hätte die grüne Fassung danach echt ausgesehen.

Das ist die gefährlichere Hälfte dieser Regel, und wir schreiben sie sonst nur
in eine Richtung auf: **Wir prüfen, ob eine Prüfung scheitern KANN. Wir prüfen
selten, ob sie am RICHTIGEN scheitert.**

Ein Test, der das Falsche misst und dabei rot ist, beweist nichts — er sieht
nur so aus. Und er ist schlimmer als ein grüner, der nichts prüft: Der grüne
weckt irgendwann Misstrauen, der rote wird repariert, bis er grün ist, und
gilt dann als Beleg.

**How to apply:**
- Nach jedem Rot: **die Fehlermeldung lesen, nicht nur ihre Farbe.** Nennt sie
  den Grund, den der Test behauptet zu prüfen?
- Beim Bauen einer Gegenprobe den Defekt **an genau einer Stelle** einbauen und
  nachsehen, ob **genau dieser** Test rot wird — nicht irgendeiner.
- Und einem roten Test darf man misstrauen. 2 Agent im dritten Fall: „Gerettet
  hat mich nur, dass ich dem roten Test nicht geglaubt habe."

## Und der dritte Schritt ist das ZURÜCKHOLEN — er wurde bisher vorausgesetzt

Eine Gegenprobe besteht aus Brechen, Messen **und Zurückholen**. Die ersten
beiden Schritte hat diese Regel immer beschrieben, der dritte galt als
selbstverständlich. Er ist es nicht.

2 Agent, 08./09.09.2026, **zweimal an einem Abend hat das Wiederherstellen den
Schaden angerichtet, den es verhindern sollte:**

| Wiederherstellung | was passierte |
|---|---|
| `cp /tmp/cb.bak … \|\| git checkout --` | Das `cp` gelang — mit einer **stundenalten** Sicherungsdatei. Also lief das `git checkout` nie, und `customBiome.ts` stand 148 Zeilen kürzer da. Aufgefallen an 13 tsc-Fehlern. |
| `git checkout -- <datei>` | Holte die **eingecheckte** Fassung zurück und löschte damit die unversionierte Arbeit an genau dieser Datei — die Behebung selbst. Aufgefallen an `grep -c 'hudFuer(i)' == 0`. |

Beide Male sah der Lauf danach aus wie ein Ergebnis: Im ersten Fall meldete
die Gegenprobe „hält nicht", im zweiten blieb sie rot. **Gemerkt hat es nur,
wer danach nachgesehen hat, ob der Baum wieder der ist, der er war.**

**How to apply:**
- **Die Sicherung trägt Commit und Prozess im Namen** (`/tmp/<datei>-<sha>-$$.bak`).
  Eine Datei namens `/tmp/cb.bak` ist keine Sicherung, sondern ein Fundstück.
- **Das Zurückholen wird geprüft, nicht angenommen** — eine Zeile, die im
  wiederhergestellten Inhalt nach dem sucht, was dort stehen muss, und sonst
  laut „ZURÜCK FEHLGESCHLAGEN" sagt.
- **`a || b` als Wiederherstellung führt `b` genau dann NICHT aus, wenn `a`
  fälschlich gelingt** — also den Rückweg nicht an den Erfolg des Vorwegs
  hängen.
- Und `git checkout --` nie auf eine Datei mit unversionierter Arbeit. Wer
  zurückholt, prüft vorher, ob der Unterschied der **Schaden** ist oder die
  **Arbeit**.
- **Und derselbe Griff nach einem abgelehnten Push.** Gemessen am 10.09.2026:
  Ein `veröffentliche`-Push wurde abgewiesen, weil `main` sich bewegt hatte.
  Der Reflex war `git checkout -- .atomar`, um den Baum zu säubern — und er
  verwarf die eigene Übernahme-Zeile, die noch nirgends stand. Es ging nichts
  Fremdes verloren und nur zwei Befehle Arbeit; die Form ist trotzdem dieselbe
  wie oben, nur mit einem anderen Anlass. **Ein abgelehnter Push heißt „setz
  neu auf `origin/main` auf", nicht „räum auf".** Wer den Baum sauber haben
  will, holt sich den veröffentlichten Stand (`git restore --source=origin/main
  -- <pfad>`) statt den eigenen wegzuwerfen — das eine ist ein Abgleich, das
  andere ein Verlust.
