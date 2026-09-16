---
name: ein-as-auf-einem-literal-bringt-den-typ-zum-schweigen
title: Ein `as` auf einem Objektliteral ist kein Typ, sondern ein Versprechen
origin: operator
rank: 40
version: 1.0.0
short: "Der Compiler prueft ein Objektliteral gegen seinen Typ — es sei denn, ein `as` steht dahinter. Dann prueft er nichts mehr, und fehlende Felder kommen erst zur Laufzeit heraus, oft weit entfernt von ihrer Ursache."
---
## Der Fall

08.09.2026, Film-Bench. `umfrageFrame` baute den Fahrzustand als Objektliteral
mit **vier** Feldern und `as PhysicsState` dahinter. Der Typ hat **acht**. Es
fehlten `brake`, `steer`, `gradePercent`, `draftBoost`.

```
tsc                 0 Fehler      ← das `as` legt ihn still
Ablauf-Test        10/10 gruen    ← er sieht den Zustand nie an
die Szene           stuerzt ab
```

**Zwei Fehlermeldungen, eine Ursache** — und die zweite stand weit weg von der
ersten:

```
textures.ts:4324    fmtGrade(d.gradePercent)               -> .toFixed auf undefined
OutrideScene:4640   currentSmoothGrade += (s.gradePercent - …)  -> NaN, UND BLEIBT
OutrideScene:5950   sun.position.y = … - s.gradePercent * 1.2   -> NaN in einer Position
                    -> THREE.computeBoundingSphere(): radius is NaN
```

Zeile 4640 ist der teure Teil: ein **Akkumulator**, der einmal NaN wird und es
bleibt. Die Meldung erscheint danach in der Geometrie — an einer Stelle, die
mit dem eigentlichen Fehler nichts zu tun hat.

## Warum es sich nicht wie eine Umgehung anfuehlt

Weil `as` wie eine Praezisierung aussieht: "das hier IST ein PhysicsState". Der
Autor weiss, was er baut, und teilt es dem Compiler mit. Tatsaechlich sagt er
ihm: **hoer auf zu pruefen.** Ohne `as` haette `tsc` die vier fehlenden Felder
sofort genannt — es ist der einzige Ort, an dem ein Objektliteral nicht gegen
seinen Typ geprueft wird.

## Die Familie

Am selben Tag viermal dieselbe Bewegung, in aufsteigender Schaerfe:

| Stelle | die zweite, alternde Behauptung |
|---|---|
| Adressliste im Release-Check | eine Liste neben dem Dateibaum |
| `film-road:132` | eine Szenenliste neben `SCENES` |
| drei Overlay-Abfragen | `sceneId === "arcade" &&` vor der Nutzlast |
| `as PhysicsState` | **eine Behauptung ueber einen Typ, die den Typ zum Schweigen bringt** |

Die ersten drei altern still. Diese hier altert nicht einmal — sie war schon
beim Schreiben falsch, und nichts hat es gesagt.

**How to apply:**
- **Kein `as` auf einem Objektliteral.** Stattdessen die Variable
  annotieren (`const s: PhysicsState = { … }`) — dann nennt `tsc` jedes
  fehlende Feld beim Namen.
- Gibt es eine Fabrik, die den vollstaendigen Wert baut (hier `physics()`),
  **benutze sie**, statt das Ergebnis nachzubauen.
- Und wenn ein `as` unvermeidlich ist: Es braucht einen Test, der die Felder
  **am echten Wert** misst — nicht eine Liste daneben, die dieselben Felder
  vergisst wie das Literal. Eine Feldliste, die weniger nennt als der Typ hat,
  prueft genau das Fehlende nicht.
