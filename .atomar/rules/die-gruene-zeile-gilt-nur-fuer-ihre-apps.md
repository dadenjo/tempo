---
name: die-gruene-zeile-gilt-nur-fuer-ihre-apps
title: Die grüne Zeile gilt nur für die Apps, die sie NENNT
origin: operator
rank: 40
version: 1.0.0
short: "Ein Deploy nimmt den ganzen Stand. Der Release-Check nimmt nur die Änderung seit dem letzten Check. Das sind verschiedene Mengen — und die Differenz ist unsichtbar, weil beide „GREEN\" heißen. Wer eine grüne Zeile für eine Freigabe verwendet, liest die Aufzählung dahinter."
---
## Der Fall

3 Agent, 05.09.2026. Der Lauf auf `6fe836a0b` meldete:

```
── GREEN · 6fe836a0b … is safe to deploy —
   geprüft: HUB (apps/prism-mobile), APP (apps/pixel-peloton) ──
```

**MARKETING steht nicht drin.** Die Freigabe, die daran hängen sollte,
betraf genau diese App: den Widerspruch zwischen Überschrift und
Kaufknopf auf `pixelwatts.com`.

Ihre eigene Formulierung: *„Hätte ich nur ‚GREEN' gelesen und nicht die
Aufzählung dahinter, wäre die Freigabe auf einem Beleg gestanden, der
genau die App nicht nennt, um die es geht."*

## Warum es passiert

Das Skript leitet die betroffenen Apps aus dem Unterschied **zum zuletzt
geprüften Stand** ab. Für sich richtig gerechnet — und trotzdem die
falsche Menge:

| | Menge |
|---|---|
| Ein **Deploy** nimmt | den ganzen **Stand** |
| Ein **Check** nimmt | die **Änderung** seit dem letzten Check |

Zwischen dem letzten Lauf, der MARKETING wirklich genannt hat, und heute
lagen **vier geänderte Dateien** in `apps/pixel-peloton-web` — darunter
die Textänderung, um die es ging. Sie war seither in keinem Lauf gebaut
worden, der sie gemeldet hätte.

## Die Regel

- **Nur die grüne Zeile mit der SHA zählt** — und sie zählt **nur für die
  Apps, die sie aufzählt.**
- Wer sie für eine Freigabe verwendet, liest die Aufzählung, nicht das
  Wort.
- Fehlt die App, um die es geht: erneut laufen lassen, mit leerem
  Heimverzeichnis, damit das Skript keinen letzten Stand kennt und alle
  drei prüft. Zwanzig Minuten.
- **„Dringend" ist kein Grund, einen ungeprüften Bau auszurollen.**

## Was am Werkzeug zu ändern wäre

Die Basis sollte der zuletzt **ausgerollte** Stand sein, nicht der zuletzt
**geprüfte**. Was geprüft wurde, sagt nichts darüber, was draußen ist —
und ausgerollt wird der ganze Stand.

## Geprueft wird, was AUSGEROLLT wird — nicht, was sich geaendert hat

der Betreiber, 05.09.2026: *„Wenn Hub ausrollen, nur Hub testen, nix mehr — sonst
werden wir nie fertig."*

Das Skript leitet die betroffenen Apps aus dem **Diff zum zuletzt geprueften
Stand** ab. Fuer eine Freigabe ist aber eine andere Menge massgeblich: **die
App, die der Deploy anfasst.** Beide fallen nur zufaellig zusammen.

Am 05.09. lagen auf `main` Aenderungen an HUB und APP. Der Lauf prueft dann
beide — richtig gerechnet, und trotzdem zwanzig Minuten fuer eine Freigabe, in
der die Haelfte davon nichts zu suchen hat: Ein Hub-Deploy schickt keine Zeile
der App irgendwohin, es sind getrennte Vercel-Projekte.

| | Menge |
|---|---|
| Ein **Deploy** nimmt | den Stand **einer App** |
| Der **Check** nahm bisher | die Aenderung **aller Apps** seit dem letzten Check |

**Die Regel:** Wer eine App ausrollt, prueft **diese** App — und nur sie. Die
Aufzaehlung hinter GREEN nennt dann genau die geprueften Apps, nicht mehr. Ein
eingeschraenkter Lauf darf **niemals** eine Zeile erzeugen, aus der jemand eine
Freigabe fuer eine ungeprueft gebliebene App ableiten kann. Das ist die
Bedingung, unter der die Abkuerzung erlaubt ist — ohne sie waere sie
gefaehrlicher als der lange Lauf.

**Und die Schranke des Hubs bleibt bestehen.** „Interne Werkzeuge muss man
weniger pruefen" gilt hier gerade nicht: Das Risiko des Hubs ist nicht, dass er
AUSFAELLT, sondern dass er HANDELT — er verschickt Kundenmails, schreibt in die
Produktionsdatenbank und haelt die Sperre gegen ungetesteten Versand. Faellt
dort etwas aus, merkt es nicht der Betreiber, sondern ein Kunde. Also: den Hub
pruefen, und nur ihn.

## Wenn `main` sich schneller bewegt als die Suite laeuft

2 Agent, 05.09.2026, nach drei Laeufen fuer einen Zweig:

```
Lauf 1   6289   ungueltig durch MICH        (mein Fix danach)
Lauf 2   6289   ungueltig durch FREMDE      (ein Merge zog fremde Arbeit
                Bewegung, ohne dass ich      in meinen Zweig, waehrend
                eine Datei angefasst habe)   ich nichts tat)
Lauf 3   6302   gilt
```

Und danach lag `main` schon wieder **sieben Commits** weiter. Die Suite braucht
zwanzig Minuten.

> **„Ich messe den zusammengefuehrten Stand" ist konstruktiv unerreichbar,
> solange mehrere Sitzungen gleichzeitig mergen.**

Ein vierter Lauf haette es nicht geloest — er waere beim Melden schon wieder
veraltet gewesen.

## Was stattdessen erreichbar ist

Drei Aussagen, die **nicht** veralten, weil sie ueber den Zweig und die
Schnittmenge sprechen statt ueber einen Zeitpunkt:

1. **Der Zweig selbst ist gemessen und gruen** — mit SHA und Testzahl.
2. **Die Schnittmenge ist gemessen**: keine gemeinsame Datei mit dem, was sich
   seither bewegt hat.
3. **Und weil „keine gemeinsame Datei" nicht reicht: der GEGENSTAND ist
   geprueft.** In ihrem Fall nannte eine fremd geaenderte Datei denselben
   Begriff dreimal — die Aenderung beruehrte ihn in **null** Zeilen.

Der dritte Punkt ist der, den man weglaesst. Zwei Aenderungen koennen dieselbe
Datei meiden und trotzdem dieselbe **Sache** betreffen.

## Und wo der zusammengefuehrte Stand doch gemessen wird

Auf `main`, durch den Release-Check vor einem Deploy. **Das ist sein Zweck** —
und der einzige Ort, an dem die Messung nicht sofort wieder veraltet, weil
zwischen ihr und dem Ausrollen nichts mehr dazwischenkommt.

Wer einen Zweig zusammenfuehrt, misst also den ZWEIG. Wer ausrollt, misst den
STAND. Beides zu verlangen, bevor ein PR gemergt werden darf, macht das Mergen
bei mehreren gleichzeitigen Sitzungen unmoeglich.
