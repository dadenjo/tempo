---
name: ein-werkzeug-wird-erkundet-bevor-es-eingehaengt-wird
title: "Ein Werkzeug wird von einem Kundschafter erkundet, bevor es jemand einhängt"
origin: operator
rank: 705
version: 1.0.0
short: "Wer ein vorhandenes Werkzeug (prism, Hub, alles aus der atomar-Welt) anbinden will, setzt einen Kundschafter auf: eine frische Sitzung, die nichts baut, sondern Zugang, Fragesprache und ein Protokoll <werkzeug>_protocol.md liefert. Was nicht im Protokoll steht, kann der Verteiler nicht weitergeben."
---
## Woher die Regel kommt (der Betreiber, 16.09.2026, Wortlaut)

„Wir müssen das in dein Regelwerk mit aufnehmen: dass man Software wie prism anbinden möchte (alles aus der atomar-Welt), dann setzt man einen Scout-Agent auf. Dieser fungiert dann als:

Wir setzen eine frische, isolierte Sitzung auf. Sein primäres Ziel ist nicht, Features zu bauen, sondern die Schnittstelle zu `prism0x2a` zu reverse-engineeren und als Werkzeug nutzbar zu machen.

- Schnittstellen-Erkundung: Der Agent sucht den Entrypoint. Bietet Prism ein CLI, das wir über Bash triggern können? Spuckt es JSON-Graphen aus, oder gibt es einen lokalen API-Endpunkt?
- Die Query-Sprache lernen: Der Agent muss herausfinden, wie man dem System Fragen stellt. Wie fragen wir zum Beispiel: „Welche Dateien rufen die Kurven-Physik-Lib auf?" oder „Wie tief ist die Vererbung im `CritScene`-Modul?"
- Das Hub-Protokoll schreiben: Als Output dieser Sitzung generiert der Prism-Agent ein kurzes Handbuch (ein `prism_protocol.md`). Darin steht exakt, welche Befehle ich als Hub in Zukunft an andere Agenten weiterreichen kann, damit diese Prism für mich abfragen.

Der Symbiose-Effekt: Sobald wir wissen, wie wir Prism triggern, schließt sich der Kreis zu unserem neuen Ticket T-450 (Wahrheits-Landkarte). Anstatt dass Wächter nur blind prüfen, ob eine Datei existiert, könnte Prism bei jedem Pull Request automatisch validieren, ob die Zusammenhänge auf der Landkarte strukturell noch stimmen. Die Landkarte wird quasi zum dynamischen Dashboard, das von Prism in Echtzeit auf Richtigkeit geprüft wird."

## Die Regel

Wer ein Werkzeug anbinden will, das es schon gibt — gleich ob aus der atomar-Welt (prism, Hub, Explorer) oder von außen —, baut es nicht nebenbei in eine laufende Bahn ein. Er setzt einen **Kundschafter** auf: eine frische, isolierte Sitzung mit genau einem Ziel, nämlich die Schnittstelle zu erkunden und für den Verteiler nutzbar zu machen.

Der Kundschafter liefert drei Dinge, in dieser Reihenfolge:

1. **Den Zugang** — Entrypoint mit Datei:Zeile: CLI (über Bash aufrufbar?), Dateiausgabe (JSON?), lokaler Endpunkt (HTTP/MCP?). Gemessen, nicht aus dem README abgeschrieben: jeder Weg wird einmal wirklich aufgerufen, mit Dauer und Antwortgröße.
2. **Die Fragesprache** — an mindestens drei konkreten Fragen aus dem Alltag des Verteilers (z. B. „Welche Dateien rufen `lib/einspur.ts` auf?", „Wie tief hängt `CritScene` in der Vererbung?") den exakten Aufruf und die exakte Antwort.
3. **Das Protokoll** — ein kurzes Handbuch `<werkzeug>_protocol.md` unter `.atomar/`, das der Verteiler an jede andere Sitzung weiterreichen kann: Befehl, erwartete Antwort, Grenzen, Preis (Dauer, Lizenz). Was nicht im Protokoll steht, kann der Verteiler nicht weiterreichen — und existiert für die Flotte nicht.

Der Kundschafter **baut keine Features** und ändert das Werkzeug nicht. Ein Befund über eine fehlende Fähigkeit ist ein Eintrag, kein Auftrag. Erst wenn das Protokoll steht, entscheidet der Verteiler, ob das Werkzeug in Gate, Landkarte oder Verteilung eingehängt wird — mit Eintrag.

## Die zweite Stufe: der Werkzeug-Agent

der Betreiber, 16.09. (Wortlaut): „Der Scout übergibt z. B. dann an einen prism Agenten, der auch vom Hub aufgesetzt werden kann, Anpassungen anfordern, die für die Hub-Software notwendig werden, und darf sie anpassen." Und: „Ok, ich schick ihn los, und dann übernimmt er alles, was wir für die Anbindung benötigen von prism."

Der Kundschafter endet mit dem Protokoll — und mit einer **Fehlliste**: was der Verteiler braucht und das Werkzeug nicht kann (eine Frage ohne Antwort, ein Aufruf, der zu lang dauert, eine Ausgabe, die kein Agent lesen kann). Jeder Punkt wird ein Eintrag. Diese Einträge baut ein **Werkzeug-Agent** (z. B. „prism Agent"), den der Verteiler aufsetzt — der Einzige, der das Werkzeug ÄNDERN darf, in dessen eigener Bahn (apps/prism), mit eigenem PR, eigenem Gate, eigenen Wächtern; jede Änderung schreibt das Protokoll fort.

Kundschafter erkundet, Werkzeug-Agent baut — nacheinander, nie zugleich. Es darf dieselbe Sitzung sein, aber die Reihenfolge steht: erst das Protokoll, dann die Fehlliste als Einträge, dann der Bau. Wer das Werkzeug nutzt (Verteiler, Bahnen), fordert an; wer es baut, liefert; das Protokoll ist der Vertrag zwischen beiden.

## Warum eine eigene Sitzung

Eine Bahn, die nebenbei kundschaftet, misst mit dem Kopf im eigenen Thema: Sie findet den Weg, den sie gerade braucht, und schreibt ihn nirgends auf. Beim nächsten Mal kundschaftet jemand anderes von vorn. Der Kundschafter hat nichts zu bauen, also hat er nichts, wohin er die Antwort verlieren könnte — außer ins Protokoll.

## Die Symbiose mit der Landkarte

Die Landkarte der Wahrheitsquellen (T-450) sagt, was wo steht. Ein angebundenes Werkzeug wie prism kann bei jedem PR prüfen, ob die Zusammenhänge auf ihr noch stimmen — Importe, Aufrufer, Zyklen —, statt nur, ob eine Datei existiert. Das ist der Grund, warum das Protokoll ZUERST kommt: Ein Wächter, der ein Werkzeug ohne Protokoll aufruft, ist ein Wächter, den nur sein Autor versteht.
