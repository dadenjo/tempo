---
name: eine-zahl-im-kommentar-schlaegt-nie-an
title: Eine Zahl, die neben ihrem Original in Prosa steht, altert unbemerkt
origin: operator
rank: 42
version: 1.0.0
short: "Eine Liste oder Konstante, die in einem Kommentar wiederholt wird, ist ein Wächter, der nie rot werden kann. Sie sieht beim Lesen richtig aus, so lange sie falsch ist."
---
## Vier Fälle an einem Tag

Am 08.09.2026 fanden sich vier Stellen, an denen eine Liste **neben** ihrem
Original lebte und langsamer alterte:

| wo | was | Folge |
|---|---|---|
| `middleware.test.ts` | der Matcher, abgeschrieben | der Test kannte `/opinions` nicht |
| `release-check.sh` | sieben Adressen, handgepflegt | fand den 404 nicht, obwohl er Adressen abruft |
| `spielAds.test.ts` | `LESE_SEKUNDEN = 6`, abgeschrieben | wird rot, sobald das Original sinkt |
| `outride/page.tsx` | **ein Kommentar** mit `[99, 51, 9]` | der Wert war längst `[198, 144, 90]` |

Die ersten drei können wenigstens rot werden. **Der vierte nicht**: Er steht in
Prosa, also prüft ihn nichts. 2 Agent fand ihn nur, weil sie den echten Wert
ausrechnen musste — sonst hätte er weiter dagestanden und beim Lesen erklärt,
wie es angeblich funktioniert.

## Warum das schlimmer ist als eine fehlende Erklärung

Ein Kommentar ohne Zahl zwingt zum Nachsehen. Ein Kommentar **mit** falscher
Zahl beantwortet die Frage — falsch — und der Leser sieht nicht nach. Er ist
kein fehlender Wächter, er ist ein **Wächter, der die falsche Antwort gibt und
dabei zuverlässig wirkt**.

Und der Folgeschaden ist derselbe wie bei einer abgeschriebenen Konstante im
Test: Wer später auf die Abweichung stößt, korrigiert im Zweifel die Stelle,
die leichter zu ändern ist — und das ist die Kopie.

**How to apply:**
- Werte in Kommentaren **benennen statt beziffern**: „die Abstände aus
  `ABSTAENDE_VOR_ZIEL_M`" statt „[99, 51, 9]". Der Name altert mit.
- Muss eine Zahl in den Text (weil sie eine Messung von einem Tag ist), gehört
  das **Datum** dazu — dann liest man sie als Momentaufnahme, nicht als Zustand.
- Und in Tests: die Konstante **importieren**, nie abschreiben. Eine zweite
  Fassung derselben Zahl ist eine zweite Wahrheit.
