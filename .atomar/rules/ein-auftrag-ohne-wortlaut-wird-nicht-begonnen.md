---
name: ein-auftrag-ohne-wortlaut-wird-nicht-begonnen
title: Ein Auftrag ohne Wortlaut wird nicht begonnen — er wird gefragt
origin: operator
rank: 39
version: 1.0.0
short: "Ein Eintrag ohne `## Worum es geht`, ohne Dauer oder Eigentümer bei `active`, auf eine offene Abhängigkeit hin oder mit unbegründetem `wartet_auf` wird nicht begonnen: die Frage wird Log-Zeile im Eintrag, die Sitzung nimmt das nächste Stück. Startprompt: NICHT ANFANGEN; Posten `pruefe-auftrag.mjs`."
---
## Woher die Regel kommt

D-111 (der Betreiber, 16.09.2026, Option A), Baustein 2 — übersetzt aus maternity-copilot `lib/agentic/guardrails.ts`: fünf Prüfungen VOR jedem Agentenaufruf, in fester Reihenfolge, und die erste rote stellt eine Frage statt den Agenten zu rufen. Kopfkommentar dort: „When a guardrail fails, the system generates questions or errors — never hallucinations." Die Erkundung steht in `.atomar/copilot_protocol.md` § 2.

Der Anlass davor (HUB, 16.09.): „heute Abend zweimal erlebt (T-451 zweimal umgeschrieben, T-465 präzisiert, während ich schon las)" — und gemessen am selben Tag: T-165 mit leerem Rumpf, T-105 mit der Vorlage über dem Befund, T-262 seit sechs Tagen `active` ohne Eigentümer. Der Startprompt zählte die Einträge auf, ohne sie zu lesen.

## Die Regel

Ein Eintrag wird nicht begonnen, sondern gefragt, wenn — in dieser Reihenfolge, die erste Lücke zählt:

1. **kein Wortlaut** — der Rumpf ist leer, nur die Vorlage, oder trägt keinen Abschnitt `## Worum es geht` (der Wortlaut des Auftrags, nicht seine Deutung);
2. **eine tote Karte** — `karten:` nennt eine Landkarte, die es nicht gibt;
3. **eine offene Abhängigkeit** — `active`, und ein `depends_on`-Ziel ist nicht erledigt;
4. **keine Dauer** — `active` ohne `expected`, oder länger als `auftrag_max_dauer`: dann wird geteilt, nicht gestartet;
5. **kein Eigentümer** — `active` ohne `owner`;
6. **unbegründetes Warten** — `wartet_auf` ohne Log-Zeile, die sagt, worauf.

Die Frage steht als Log-Zeile im Eintrag, gerichtet an den, der ihn geschrieben hat — und die Sitzung nimmt derweil das nächste Stück (Regel `zwei-zustaende-fertig-oder-blockiert`). Der Startprompt schreibt vor jeden solchen Eintrag **NICHT ANFANGEN** und die Frage; der Posten `pruefe-auftrag.mjs` misst dasselbe im Gate. Eine Sitzung, die auf einen leeren Auftrag losfährt, erfindet ihn — und am Ende steht etwas da, das niemand bestellt hat.

Form-Lücken (1, 6) gelten ab `stichtag_auftrag` (einstellungen.md); Zustands-Lücken (3, 4, 5) immer, denn sie beschreiben, was JETZT falsch läuft.

## Was bewusst NICHT übernommen wurde

`LOW_CONFIDENCE` (Routing-Konfidenz unter 0,15): es gibt keinen Router; die Zuweisung trifft der Verteiler mit `owner`. Die Kostenstufen `minimal | standard | premium` (Modellwahl ist der Betreibers Sache beim Aufsetzen, `team.md`). Der „questioner agent", der die Frage formuliert: die Frage schreibt die Sitzung selbst.
