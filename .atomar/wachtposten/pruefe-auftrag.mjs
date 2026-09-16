#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// MISST: ob jede offene/aktive Aufgabe vollstaendig genug ist, um begonnen zu werden — Rumpf mit `## Worum es geht`, lebende Karten, erledigte Abhaengigkeiten, Schaetzung und Eigentuemer bei `active`, begruendetes Warten. Die erste rote Bedingung je Eintrag, mit ihrer Frage.
// TAKT: im Gate (gate-core.sh), im Startprompt (dort „NICHT ANFANGEN") und auf Zuruf.
// AUSLOESER: eine Aufgabe, die ohne Wortlaut, ohne Dauer, ohne Eigentuemer oder auf eine offene Antwort hin begonnen wuerde.
// REPARATUR: die Frage im Eintrag beantworten — Rumpf nachtragen (`rumpf <ID> --datei …`), `set <ID> --expected … / --owner … / --wartet-auf … --reason …`; Altbestand vor `stichtag_auftrag` bleibt gezaehlt.
// ZUSTAENDIG: wer den Auftrag geschrieben hat (meist der Verteiler); den Posten faehrt der Verteiler.
/*
 * WACHTPOSTEN: WIRD HIER EIN AUFTRAG BEGONNEN, DEN ES NOCH NICHT GIBT? (T-470)
 *
 * D-111 Baustein 2, uebersetzt aus maternity-copilot lib/agentic/guardrails.ts
 * (Protokoll .atomar/copilot_protocol.md § 2). Dort liefen fuenf Pruefungen
 * VOR jedem Agentenaufruf, in fester Reihenfolge, und die erste rote stellte
 * eine FRAGE statt den Agenten zu rufen. Die Logik steht in lib/auftrag.mjs;
 * dieser Posten ist ihr Kindprozess mit Exit-Code, der Startprompt ihr
 * zweiter Leser.
 *
 * GEMESSEN am 16.09.2026 (13 offene/aktive Aufgaben): T-165 mit leerem
 * Rumpf, T-105 mit der Vorlage, T-262 seit dem 10.09. `active` ohne
 * Eigentuemer, T-465 `wartet_auf` von Hand ohne Grund-Zeile. Keiner hatte es
 * gesehen: der Startprompt zaehlt Eintraege auf, ohne sie zu lesen.
 *
 * Drei Zustaende: 0 still, 1 BEFUND, 2 konnte nicht laufen. Altbestand
 * (Form-Befund vor `stichtag_auftrag`) wird gezaehlt, nicht gemeldet.
 *
 *   node .atomar/wachtposten/pruefe-auftrag.mjs
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { OK, BEFUND, abbruch, wurzel, werkzeug } from "./_anlauf.mjs";

const WURZEL = wurzel(import.meta.url);

const LIB = werkzeug(WURZEL);
if (LIB === null) {
  abbruch(
    "das Backlog-Werkzeug ist nicht auffindbar",
    "Gesucht in tools/atomar-backlog/lib und in node_modules. Ohne es gibt es keine Eintraege zu pruefen.",
  );
}

const lib = (n) => import(new URL(n, "file://" + LIB + "/"));
const { auftragsBefunde, kartenNamen } = await lib("auftrag.mjs");
const { lies: liesEinstellungen } = await lib("einstellungen.mjs");
const store = await lib("store.mjs");

let liste;
try {
  liste = await store.list(WURZEL);
} catch (err) {
  abbruch("die Eintraege sind nicht lesbar", String(err?.message ?? err));
}
let einstellungen;
try {
  einstellungen = await liesEinstellungen(WURZEL);
} catch (err) {
  abbruch("die Einstellungen sind nicht lesbar", String(err?.message ?? err));
}

const stichtag = einstellungen.stichtag_auftrag ?? null;
const { rot, altbestand } = auftragsBefunde(liste, {
  karten: await kartenNamen(WURZEL, fs, path),
  stichtag,
  maxDauer: einstellungen.auftrag_max_dauer ?? null,
});
/*
 * EINE UNLESBARE AUFGABE IST EIN BEFUND, KEIN SCHWEIGEN (derselbe Fund wie
 * bei pruefe-entscheidung.mjs): `store.list` legt sie nach `broken`, und ein
 * Posten, der das nicht liest, ist ueber genau dem Fall still.
 */
for (const b of liste.broken ?? []) {
  if (/^T-/.test(b.id)) rot.push({ id: b.id, title: "(nicht lesbar)", code: "UNLESBAR", frage: b.reason, owner: null, status: "?" });
}

const offen = liste.filter((x) => x.entry.kind === "task" && (x.entry.status === "open" || x.entry.status === "active")).length;

if (rot.length === 0) {
  if (altbestand.length > 0 || !stichtag) {
    process.stdout.write(
      `still · ${offen} offene/aktive Aufgaben, ${altbestand.length} unvollstaendig (Altbestand${stichtag ? ` vor ${stichtag}` : "; kein stichtag_auftrag in .atomar/einstellungen.md — die Form misst niemanden"})\n`,
    );
  }
  process.exit(OK);
}

process.stdout.write(`BEFUND · ${rot.length} Aufgabe(n), die so nicht begonnen werden${altbestand.length ? ` · dazu ${altbestand.length} Altbestand (nur gezaehlt)` : ""}\n`);
for (const r of rot) {
  process.stdout.write(`  ${r.id}  ${r.status} · ${r.owner ?? "ohne Eigentuemer"} · ${r.title}\n    ${r.code} · ${r.frage}\n`);
}
process.stdout.write(
  "\n  Dieser Posten setzt nichts. Die Frage gehoert als Log-Zeile in den Eintrag,\n"
  + "  und die Sitzung nimmt derweil das naechste Stueck.\n",
);
process.exit(BEFUND);
