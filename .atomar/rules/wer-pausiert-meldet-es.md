---
name: wer-pausiert-meldet-es
title: Wer pausiert, sagt es — Stille ist keine Auskunft
origin: operator
rank: 30
version: 1.0.0
short: "Eine Sitzung, die aufhört zu arbeiten, sieht von außen genauso aus wie eine, die gerade nachdenkt. Der Verteiler wartet dann auf jemanden, der nicht mehr arbeitet — und der Betreiber wartet auf den Verteiler."
---
## Warum

der Betreiber, 06.09.2026, nachdem eine Sitzung nach einem Deploy still geworden war:

> *„Sollte er pausieren, muss das in die Steuerabläufe und ins Regelwerk."*

**Der Fall am selben Abend, zweimal:**

| | |
|---|---|
| 3 Agent | meldete *„T-119 fange ich als Nächstes an"* — und fing nicht an. Vier Stunden Stille, Eintrag auf `open`. |
| 0 Agent | meldete *„release-check ist durchgelaufen, ich schaue mir das Ergebnis an"* — danach nichts. der Betreiber fragte: *„Arbeitet er daran oder hat er pausiert?"* |

**Beide Male war die Stille nicht zu deuten.** Sie kann heißen: es läuft ein
langer Lauf, ich lese gerade, ich habe aufgehört, ich habe es vergessen.

## Warum es teuer ist

**Der Verteiler wartet, und der Betreiber wartet auf den Verteiler.** Am 06.09. hing
an einer solchen Stille ein Deploy, der das Dashboard sehend gemacht hätte —
die Ansicht, aus der über Kundenmails entschieden wird und die seit zwei Tagen
blind war.

**Und keine Uhr kann es unterscheiden:** Der Stillstands-Posten misst
Schweigen, nicht Untätigkeit. Er meldet dieselbe Zeile für eine Sitzung, die
zwanzig Minuten baut, und für eine, die aufgehört hat.

## Die Regel

- **Wer aufhört — für heute, für eine Stunde, ganz — sagt es**, in einem Satz
  und an den Verteiler. Nicht als Höflichkeit: Es ist die einzige Angabe, die
  Stille deutbar macht.
- **Und der Eintrag sagt es auch.** Eine Ankündigung in einer Nachricht ist
  kein Stand ([[ein-eintrag-der-ueber-sich-selbst-luegt]]). Wer eine Aufgabe
  liegen lässt, setzt sie zurück auf `open` oder schreibt eine Logzeile, woran
  es hängt.
- **„Ich habe nichts Laufendes" ist eine vollständige Antwort** und keine
  Entschuldigung. Sie ist dem Verteiler mehr wert als eine Ankündigung.
- **Und der Verteiler fragt, statt zu mahnen oder zu schließen.** Vier Stunden
  Stille sind kein Befund. Am 06.09. hat genau diese Frage verhindert, dass
  gegen einen zweimal geänderten Zuschnitt gebaut wurde.

## Was am Steuerablauf fehlt

Der Posten kann „pausiert" heute nicht von „arbeitet" unterscheiden, **weil es
die Angabe nicht gibt**. Erst wenn eine Pause gemeldet wird, ist Stille ohne
gemeldete Pause ein Befund — vorher ist jede Meldung eine Vermutung
([[langlaeufer-brauchen-einen-takt]]).

**Solange das fehlt, trägt der Verteiler es von Hand:** Er fragt nach, und er
schreibt die Antwort in den Eintrag, nicht nur in seinen Kopf.

## Und die häufigere Form: ankündigen und warten

der Betreiber, 06.09.2026:

> *„Es scheint mir, dass generell oft angekündigt und nicht gestartet wird.
> Ohne Input dieses ‚ok' ist eigentlich völlig nutzlos — und wenn tatsächlich
> notwendig, muss es von dir kommen, um den Laden am Laufen zu halten."*

**Eine Ankündigung, die auf eine Antwort wartet, ist ein Stillstand in
Berichtsform.** Sie sieht aus wie Arbeit, sie kostet eine Runde, und sie liefert
nichts.

Und das „ok", auf das gewartet wird, trägt in den meisten Fällen **keine
Information**: Wer schon weiß, was der nächste Schritt ist, braucht ihn nicht
genehmigt zu bekommen.

### Die Regel

- **Wer den nächsten Schritt kennt, fängt an.** Die Meldung kommt, wenn es
  steht — nicht davor.
- **Wer wirklich eine Entscheidung braucht, stellt eine FRAGE mit Möglichkeiten
  und ihren Preisen** — keine Ankündigung. Eine Frage ist beantwortbar, eine
  Ankündigung nur bestätigbar.
- **Und die Antwort kommt vom VERTEILER, nicht vom Betreiber.** der Betreiber
  entscheidet, was gebaut wird und was es kosten darf. Ob jemand jetzt anfangen
  darf, entscheidet er nicht — das ist der Job des Verteilers, und er hält den
  Laden damit am Laufen.

### Was der Verteiler dabei falsch macht

**Wer auf jede Ankündigung mit „ja, mach" antwortet, erzieht zum Warten.** Am
06.09. sind mehrere Ankündigungen bei ihm eingegangen und bestätigt worden —
und jede Bestätigung hat gelehrt, dass Warten der richtige Weg ist.

**Also: nicht bestätigen, sondern das nächste Mal fragen, warum nicht schon
angefangen wurde.** Und wenn eine Sitzung wirklich blockiert ist, gehört das
Woran in den Eintrag, nicht in eine Ankündigung.
