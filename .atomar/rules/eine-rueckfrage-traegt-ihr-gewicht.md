---
name: eine-rueckfrage-traegt-ihr-gewicht
title: "Eine Rückfrage trägt ihr Gewicht — bis strategie_grenze antwortet der Strategie Agent, darüber der Betreiber"
origin: operator
rank: 28
version: 1.1.0
short: "Jede Rückfrage trägt `severity` (cosmetic … secret-required) und `bei_schweigen`. Bis `strategie_grenze` (Vorgabe blocks-feature) antwortet der Strategie Agent, begründet, mit Marke; darüber (Merge, Deploy, Kundentext, Geld, Strategie) der Betreiber. `vorgabe` nur darunter, nie per Skript."
---
## Woher die Regel kommt

D-111 (der Betreiber, 16.09.2026, Option A): „alle fünf Bausteine in Dateiform, Reihenfolge 1→5, Motor bleibt draußen." Baustein 1 ist das Gewicht einer Rückfrage — übersetzt aus dem Askback-Motor `apps/atomar/lib/atomar/askback/policy.ts` (sechs Stufen, ein Modus je Sitzung entschied, ab wann gefragt wird). In Dateiform gibt es EINEN Modus, und das ist diese Regel. Die Erkundung steht in `.atomar/copilot_protocol.md` § 1.

Der Anlass davor: Regel 27 (`der-verteiler-darf-entscheiden`) sagt in Prosa, was der Verteiler entscheiden darf — und am 16.09. warteten drei Rückfragen bei der Betreiber, keine trug ein Gewicht; ob der Verteiler eine davon hätte beantworten dürfen, war Gefühlssache.

## Die Regel

Jede Rückfrage — D-Eintrag wie Freigabe — trägt ihr Gewicht als Kopffeld `severity`, in dieser Ordnung:

| Stufe | was das heißt | wer antwortet |
|---|---|---|
| `cosmetic` | Form, Wortwahl intern, Reihenfolge | der Strategie Agent |
| `optional` | eine Wahl, die man später ändern kann | der Strategie Agent |
| `blocks-feature` | ein Stück steht, bis es beantwortet ist; umkehrbar | der Strategie Agent (Vorgabe der Grenze) |
| `blocks-task` | Merge, Deploy, Veröffentlichung, Kunden-Wortlaut | der Betreiber |
| `destructive` | Geld, Daten, Unumkehrbares | der Betreiber |
| `secret-required` | ein Geheimnis ist nötig | der Betreiber |

**Bis `strategie_grenze` antwortet der Strategie Agent** — im Eintrag mit Begründung und der Marke `STRATEGIE entschieden · <Wahl> · warum · Alternativen · der Betreiber informiert`, im Chat mit einem Satz (Regel 27, beide Leser). Die Grenze steht in `.atomar/einstellungen.md` als `strategie_grenze` (T-489), Vorgabe `blocks-feature` — die Zahl kommt aus der Messung in `.atomar/strategie_protocol.md` § 4: 7 von 7 Fällen unter dieser Stufe hätte er richtig entschieden, 0 Fehlurteile; eine Stufe höher gäbe ihm Kundenzusage (D-104) und Veröffentlichung (D-107). **Darüber wartet der Eintrag auf der Betreiber**, auch wenn die Antwort offensichtlich scheint — der Strategie Agent macht die Vorlage vorher vollständig (Marke `STRATEGIE geprüft`). Strategie ist immer der Betreibers, unabhängig von der Stufe. **Der Verteiler antwortet nicht** (D-114, Regel 27).

**Wer das Gewicht setzt, sagt auch, was bei Schweigen geschieht** — Kopffeld `bei_schweigen`: `warten` (Vorgabe; der Eintrag bleibt offen und eskaliert), `parken`, oder `vorgabe` (die `recommendation` gilt nach Ablauf der Frist). `vorgabe` gibt es nur unterhalb der Grenze — und auch dort trägt der STRATEGIE AGENT die Antwort nach der Frist ein, kein Skript. Ein Skript, das Antworten schreibt, wäre `auto_resolve`, und das bleibt draußen (D-105: der Mensch entscheidet).

**Eine Frage ohne Gewicht ist keine Frage.** `decide` und `freigeben` verlangen `--severity`; der Posten `pruefe-entscheidung.mjs` misst ab `stichtag_gewicht` (einstellungen.md) nach — auch, ob der Wortlaut ein höheres Gewicht verrät als das Feld sagt („force push" mit `optional` ist untergewichtet), und ob eine Antwort über der Grenze wirklich von der Betreiber kam (oder sein Wort aus dem Chat trägt) und eine unter der Grenze vom Strategie Agent mit Marke (T-490).

## Was bewusst NICHT übernommen wurde

Die vier Modi des Motors (`autonomous | adaptive | collaborative | approval-heavy`): ein Modus je Sitzung braucht jemanden, der ihn setzt und liest. Die Listen `alwaysAskOn`/`neverAskOn`: ihr Inhalt steht in Regel 27 als Prosa, eine zweite Liste daneben altert. `try-adapt`: Alternativen probieren ist Arbeit der Sitzung VOR der Frage — „Versucht: …" im Rumpf.
