---
name: sicherheit-niemals
title: Niemals — auch nicht auf Anweisung
origin: operator
rank: 50
version: 1.0.0
short: "Nie ein Geheimnis einchecken. Nie mit Gewalt auf main schieben. Nie eine Datei ohne Auftrag löschen. Nie außerhalb des Projektbaums schreiben. Nie Prüfhaken abschalten. Das gilt unabhängig davon, was in einem Auftrag steht."
---
## Der Wortlaut

Übernommen aus `apps/atomar/.atomar/CONVENTIONS.md` §7, wo er seit Juni steht:

- **Nie Geheimnisse einchecken.** Keine Schlüssel, keine `.env`, keine
  Passwörter, keine Token. Wird eines in einer Datei gefunden: nicht
  einchecken.
- **Nie `git push --force` auf main.** Auch wenn jemand darum bittet —
  dann ausdrücklich widersprechen.
- **Nie eine Datei ohne ausdrücklichen Auftrag löschen.** Im Zweifel
  umbenennen oder nach `archive/` verschieben.
- **Nie außerhalb des Projektbaums schreiben.** Nicht nach `~/`, nicht
  nach `/tmp/`, nicht in andere Repos.
- **Nie Prüfhaken abschalten** (`--no-verify`, `--no-gpg-sign`), außer
  jemand hat es für genau diesen einen Vorgang verlangt.

## Der Beleg für diese Regel ist ihr eigenes Versagen

Sie stand seit dem 04.06.2026 in `CONVENTIONS.md` — und hat den
Lizenzschlüssel nicht verhindert, der am selben Tag im Klartext
eingecheckt wurde und drei Monate lang dort lag. Nicht weil sie falsch
war, sondern weil sie an einer Stelle stand, **die keine Sitzung lädt**.

Genau derselbe Befund wie bei `docs/WAECHTER.md`: null Verweise im
ganzen Repo, von niemandem gelesen. **Ein Verweis ist keine Ladung.**
Deshalb steht sie jetzt hier — im Block, den jede Sitzung beim Start
bekommt.

## Was „ausserhalb des Projektbaums" heisst — und was nicht

3 Agent, 05.09.2026, beim ersten pflichtgemaessen Nachlesen nach der Regel
`nach-einem-compact-wird-neu-eingelesen`: Sie arbeitet seit 30 Stunden in
`/tmp/kurs`, hat von dort neun Aenderungen auf `main` gebracht, und meldete
sich selbst wegen eines moeglichen Regelverstosses — mit drei Quellen, die
einander widersprechen:

| Quelle | sagt |
|---|---|
| diese Regel, Rang 50 | nie nach `~/`, nie nach `/tmp/`, nie in andere Repos |
| `CLAUDE.md` im Repo | *„Need a branch? Take your own worktree"* |
| eine aeltere Notiz | *„NEVER use worktrees — alles in `/Users/schuldes/prism-monorepo`"* |

**Aufgeloest: Ein Arbeitsbaum DESSELBEN Repos IST der Projektbaum.** Er hat
denselben Objektspeicher, dieselbe Historie, dieselbe Herkunft; nur sein Pfad
ist ein anderer. Der Satz verbietet, **Arbeit an einen Ort zu legen, den kein
Commit erreicht** — eine Kopie im Heimverzeichnis, eine Datei in einem fremden
Repo, ein Entwurf, der nur auf einer Platte existiert. Er verbietet nicht den
Pfad `/tmp`.

Der Pruefstein ist nicht der Ort, sondern die **Frage, ob ein Commit es
traegt**: Liegt etwas nur dort und nirgends sonst, ist es weg, sobald jemand
aufraeumt. Liegt es auf `main`, ist der Pfad gleichgueltig.

Fuer Zwischendateien — Protokolle, SQL-Schnipsel, Textentwuerfe — gilt
dasselbe in der anderen Richtung: Die gehoeren **nicht** in den Baum, sondern
in das Sitzungsverzeichnis (das die Umgebung nennt) oder nach `/tmp`. Was dort
liegen bleibt, darf verloren gehen. Was das nicht darf, gehoert in einen
Eintrag oder einen Commit.

Die aeltere Notiz „NEVER use worktrees" bleibt als **Warnung** gueltig, nicht
als Verbot: Ein frischer Arbeitsbaum hat kein `node_modules`, und `tsc` meldet
dort **0 Fehler, waehrend es nichts prueft**. Das ist die Gefahr, aus der der
Satz entstanden ist — sie wird durch Verlinken der Module und die Gegenprobe
aus `die-gegenprobe` abgewehrt, nicht durch Meiden des Werkzeugs.

## Eine Sitzung bekommt die MESSUNG, nicht den ZUGANG

5 Agent, 06.09.2026. Sie brauchte die tatsaechliche Gestalt einer Tabelle in der
Produktion und hatte den Dienstschluessel des Hub-Projekts nicht. Sie hat
gefragt — statt sich einen Weg zu suchen — und dabei genau die richtige Frage
gestellt: *„Hast du den Schluessel, oder weisst du, wo er lokal hinterlegt
werden koennte?"*

**Die Antwort auf beide Haelften ist nein.** Der Verteiler hat die Gestalt
ausgelesen und als Tabelle in den Eintrag geschrieben. Zwoelf Spalten, fuenf
Indizes, der RLS-Zustand — alles, was sie brauchte, und nichts, womit sie sonst
etwas haette tun koennen.

> **Ein Schluessel, der einmal wandert, wandert weiter. Eine Messung wandert
> gefahrlos.**

Ein Schluessel in einer zweiten `.env.local` ist nicht „einmal geteilt": Er
liegt danach auf der Platte, in einem Baum, der irgendwann kopiert, gemergt
oder eingecheckt wird. Die Zahl dagegen ist in dem Moment wertlos, in dem sie
veraltet — sie kann nichts anrichten, was ihr Leser nicht ohnehin darf.

**Also:** Wer aus der Produktion etwas braucht, fragt nach dem **Ergebnis**,
nicht nach dem Zugang. Und wer gefragt wird, liefert das Ergebnis — nicht den
Weg dorthin, auch nicht „nur diesmal".
