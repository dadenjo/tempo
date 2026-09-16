---
name: jede-entscheidung-ein-eintrag
title: Jede Entscheidung bekommt einen Eintrag — und der trägt alles zum Entscheiden
origin: operator
rank: 900
version: 1.0.0
short: "Wer im Gespräch fragt, hat nicht gefragt. Der Eintrag trägt Frage, Möglichkeiten mit ihren Folgen, die Messung und eine Empfehlung mit Begründung — und am Ende die Antwort im Wortlaut, nicht nur ihr Ergebnis."
---
## Der Prüfstein

Nicht „ist es aufgeschrieben", sondern: **jemand liest den Eintrag in drei
Wochen, ohne Erinnerung an das Gespräch von heute, und kann entscheiden.**
Kann er es nicht, fehlt etwas im EINTRAG — nicht in seinem Gedächtnis.

Kein „siehe Gespräch". Kein „3 hat es gemessen". Was man zum Entscheiden
braucht, steht drin. Und wenn entschieden ist, steht die Antwort im
Wortlaut da — nicht nur, welche Möglichkeit gewonnen hat.

## Die Grenze: ein Eintrag ist eine VERÖFFENTLICHUNG

Ein Geheimnis wird beschrieben, nicht hineinkopiert. Der Eintrag liegt in git,
geht mit jedem Klon mit und wird auf einer Seite angezeigt — er ist eine
Veröffentlichung.

Diese Ausnahme steht hier und nicht in einer eigenen Regel, weil sie dort stehen
muss, wo die Pflicht steht: Wer „alles Nötige gehört hinein" liest und die
Grenze zwei Dateien weiter, liest sie nie.

Der Anlass, 04.09.2026: Ein Lizenzschlüssel wurde beim Dokumentieren ein zweites
Mal veröffentlicht — im Wortlaut in den Eintrag geschrieben, damit die
Entscheidung aus dem Eintrag heraus zu treffen ist. Die Absicht war richtig, das
Ergebnis war es nicht. „Der Schlüssel aus `settings/license.yml`, beginnend mit
`BFD6`" trägt dieselbe Entscheidung und nicht das Geheimnis.

## Warum eine Empfehlung dazugehört

Damit der Entscheidende widersprechen kann, statt bei null anzufangen. Eine
Frage ohne Empfehlung schiebt die ganze Denkarbeit weiter; eine Empfehlung
mit Begründung macht aus einer Aufgabe eine Prüfung.

Sie steht als ein Satz im Feld `recommendation` und ausführlich im Rumpf —
im Feld, damit sie nicht im Log versickert.

## Warum das Werkzeug danach fragt

Gemessen am 04.09.2026: Entscheidungen, die mit einem Rumpf angelegt wurden,
tragen 203 bis 403 Zeichen Begründung. Zwei, die ohne angelegt wurden, tragen
**null** — und in einer davon stehen 834 Zeichen Begründung im *Log*, wo sie
niemand sucht, der entscheiden will.

Das Format hatte den Platz. Der bequeme Weg gewann, weil nichts nach dem
anderen fragte. Deshalb bringt `atomar decide` einen Rumpf mit, der die vier
Fragen stellt: eine leere Überschrift ist eine Frage, eine fehlende ist keine.
