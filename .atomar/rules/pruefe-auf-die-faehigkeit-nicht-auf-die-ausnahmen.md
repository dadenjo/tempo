---
name: pruefe-auf-die-faehigkeit-nicht-auf-die-ausnahmen
title: Prüfe auf den Fall, der die Fähigkeit HAT — nicht auf die, die sie nicht haben
origin: operator
rank: 80
version: 1.0.0
short: "Eine Aufzählung wächst, eine Ausnahmeliste altert. Wer auf „ist es einer der bekannten Sonderfälle?\" prüft, lässt jeden neuen Fall lautlos durch — und zwar in die falsche Richtung."
---
## Der Fall

3 Agent, 05.09.2026. Die Oberfläche entschied so, ob Eingabefelder
erscheinen:

```
{vorlage?.textArt === "code" ? "hier gibt es nichts zu bearbeiten"
                             : <die Eingabefelder>}
```

Am selben Abend kam ein **dritter** Fall dazu — `klartext`. Er fiel
lautlos durch die Prüfung und bekam Felder, die keine Wirkung hatten. Auf
dem Bildschirm standen danach **drei Fassungen desselben Vorgangs**: der
Text der alten Vorlage in den Feldern, die Vorschau der neuen, und
versandt wurde ein dritter.

`textArt !== "entwurf"` hätte gehalten — die Prüfung auf den Fall, der
Felder **haben soll**, statt auf den, der keine hat.

## Warum die Typangabe nicht half

Die Oberfläche führte **ihre eigene Kopie** der Aufzählung. Zwei Listen
für dieselbe Sache, und die eine veraltet. Derselbe Satz wie bei
Wächtern, nur mit einem Typ statt einer Regel.

## Dreimal an einem Tag, in drei Formen

- Ein Wächter mit **Ausnahmeliste** statt einem Merkmal am Objekt (T-034)
- Ein Vermerk „ist Grund" in einer Liste statt **am Element** (T-055)
- Diese Verzweigung

Alle drei fragen „ist es einer der bekannten Sonderfälle?" statt „hat es
die Eigenschaft?". Die erste Frage muss man bei jeder Erweiterung neu
beantworten. Die zweite beantwortet sich selbst.

## Und die schärfere Hälfte des Befunds

Die Vorschau **log nicht** — sie kam wirklich aus dem Versand-Renderer.
Nur die Felder daneben kamen aus einer anderen Quelle.

> *„Nicht ‚die Vorschau lügt', sondern ‚die Vorschau sagt die Wahrheit und
> die Felder daneben eine andere'. Wer hineinschreibt, sieht die Vorschau
> sich nicht bewegen und hält es für Trägheit."*

Zwei richtige Anzeigen nebeneinander, die von verschiedenen Ständen
sprechen, sind schwerer zu erkennen als eine falsche.

## Und es trifft Wächter genauso

Am selben Abend, vierter Fall der Familie und der erste an einem Wächter:

```
it("die Oberfläche zeigt dann kein Bearbeitungsfeld", () => {
  assert.match(SEITE, /vorlage\?\.textArt === "code"/, …)
```

Er verlangte den Vergleich **wörtlich**. Er hat damit die *Implementierung*
festgeschrieben statt der *Eigenschaft* — und blieb grün, während der neue
Fall durch die Verzweigung fiel: Der Vergleich, den er verlangte, stand ja
noch da.

**Er hat genau das bewacht, was kaputt war.**

> Ein Wächter, der eine Schreibweise verlangt statt einer Eigenschaft, ist
> eine Ausnahmeliste mit einem grünen Haken davor.

Die Reparatur ist dieselbe Bewegung: Er verlangt jetzt die Frage nach der
Fähigkeit **und verbietet ausdrücklich** den Vergleich auf eine einzelne
Art. Damit fällt er beim nächsten neuen Fall von selbst, statt ihn
durchzulassen.
