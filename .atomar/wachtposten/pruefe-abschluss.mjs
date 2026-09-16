#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// MISST: ob jede erledigte Aufgabe (umgesetzt|done), die ab `stichtag_abschluss` geschlossen wurde, eine Abschlussmeldung ihres Eigentuemers traegt — die sieben Marken PR/Commit, Dateien (bei PR), tsc/Suite, Gegenprobe, PLAN/IST, offen:, UNGEPRUEFT: in EINER Log-Zeile. Altbestand davor wird gezaehlt, nicht gemeldet.
// TAKT: im Gate (gate-core.sh) und auf Zuruf.
// AUSLOESER: eine Aufgabe wurde ohne vollstaendige Abschlussmeldung geschlossen — meist von einem anderen als dem Eigentuemer (der `set`-Weg haelt den Eigentuemer selbst an).
// REPARATUR: die Zeile beim Eigentuemer holen und als `log <ID> "…"` nachtragen (`--von <Eigentuemer>`), mit allen fehlenden Marken; nie die Marken erfinden.
// ZUSTAENDIG: der Eigentuemer der Aufgabe; den Posten faehrt der Verteiler.
/*
 * WACHTPOSTEN: IST DAS FERTIG — ODER STEHT NUR „FERTIG" DA? (T-473)
 *
 * D-111 Baustein 5, uebersetzt aus maternity-copilot lib/agentic/outputContract.ts
 * (Protokoll .atomar/copilot_protocol.md § 5). Die Logik liegt in
 * lib/abschluss.mjs; `set --status umgesetzt|done` haelt den Eigentuemer
 * schon beim Schreiben an. Dieser Posten ist die zweite Stelle: der Verteiler
 * schliesst Eintraege NACH dem Merge, oft ohne die Zeile der Sitzung zu lesen
 * — und die Kaskade schliesst ohne Sperre.
 *
 * GEMESSEN 16.09.2026: 416 erledigte Aufgaben, PLAN/IST in 13. Mit Stichtag
 * 16.09. waeren 56 von 59 an diesem Tag geschlossenen rot — deshalb gilt der
 * Vertrag ab 17.09.; der Bestand davor wird gezaehlt, nicht gemeldet.
 *
 * Drei Zustaende: 0 still, 1 BEFUND, 2 konnte nicht laufen.
 *
 *   node .atomar/wachtposten/pruefe-abschluss.mjs
 */

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
const { abschlussBefunde } = await lib("abschluss.mjs");
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

const stichtag = einstellungen.stichtag_abschluss ?? null;
const { rot, altbestand, geprueft } = abschlussBefunde(liste, { stichtag });
for (const b of liste.broken ?? []) {
  if (/^T-/.test(b.id)) rot.push({ id: b.id, title: "(nicht lesbar)", owner: null, fehlend: [`UNLESBAR · ${b.reason}`], tag: "?" });
}

if (rot.length === 0) {
  process.stdout.write(
    `still · ${geprueft} erledigte Aufgaben mit Abschlussmeldung, ${altbestand} ohne (Altbestand${stichtag ? ` vor ${stichtag}` : "; kein stichtag_abschluss in .atomar/einstellungen.md — der Vertrag misst niemanden"})\n`,
  );
  process.exit(OK);
}

process.stdout.write(`BEFUND · ${rot.length} erledigte Aufgabe(n) ohne vollstaendige Abschlussmeldung${altbestand ? ` · dazu ${altbestand} Altbestand (nur gezaehlt)` : ""}\n`);
for (const r of rot) {
  process.stdout.write(`  ${r.id}  ${r.tag} · ${r.owner ?? "ohne Eigentuemer"} · ${r.title}\n    fehlt: ${r.fehlend.join(", ")}\n`);
}
process.stdout.write(
  "\n  Dieser Posten setzt nichts. Die Zeile holt man beim Eigentuemer und traegt sie nach\n"
  + "  (`log <ID> \"…\" --von <Eigentuemer>`) — die Marken werden nicht erfunden.\n",
);
process.exit(BEFUND);
