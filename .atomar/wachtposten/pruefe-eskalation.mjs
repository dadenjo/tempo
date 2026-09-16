#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// MISST: wie lange alles, was auf einen MENSCHEN wartet (offene Entscheidung/Freigabe, Aufgabe mit wartet_auf entscheidung|handgriff), schon wartet — in zwei Stufen aus einstellungen.md: ERINNERUNG (erinnerung_nach, Vorgabe 24h) und ESKALATION (eskalation_nach, Vorgabe 72h); Eskalation vor Erinnerung, Schwelle inklusiv. Kein auto_resolve.
// TAKT: je Durchgang von wachtposten-stillstand.sh (900 s, meldet Stufen-WECHSEL), im Lagebericht des Verteilers, einzeln auf Zuruf.
// AUSLOESER: ein wartender Eintrag ueberschreitet eine Schwelle — oder hat keine Uhr (keine Zeile, die das Warten setzt).
// REPARATUR: ERINNERUNG = der Verteiler erinnert im Eintrag; ESKALATION = im Chat, mit dem, was bei Schweigen geschieht (bei_schweigen, T-469) — und traegt es dann selbst ein. Die Zahlen aendert man in einstellungen.md, nicht hier.
// ZUSTAENDIG: HUB Opus.
/*
 * WACHTPOSTEN: WIE LANGE WARTET HIER JEMAND AUF EINEN MENSCHEN? (T-472)
 *
 * D-111 Baustein 4, uebersetzt aus maternity-copilot lib/agentic/escalationPolicy.ts
 * (Protokoll .atomar/copilot_protocol.md § 4). Die Logik liegt in
 * lib/eskalation.mjs und ist rein; dieser Posten ist ihr Kindprozess mit
 * Exit-Code, wachtposten-stillstand.sh und der Lagebericht sind ihre
 * weiteren Leser.
 *
 * Exit 0: keine Eskalation (Erinnerungen sind Ausgabe, kein Befund — sonst
 * ist das Gate taeglich rot). Exit 1: mindestens eine ESKALATION oder ein
 * wartender Eintrag OHNE UHR. Exit 2: konnte nicht laufen.
 *
 * ER MELDET, ER SETZT NICHT. `auto_resolve` (escalationPolicy.ts:97-105)
 * gibt es hier nicht: D-105, der Mensch entscheidet. Ein Eintrag mit
 * `bei_schweigen: parken|vorgabe` bekommt bei ESKALATION den Zusatz, was der
 * Verteiler jetzt von Hand tut.
 *
 *   node .atomar/wachtposten/pruefe-eskalation.mjs [--alle]   (--alle: auch Stufe 0 zeigen)
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
const { eskalationen, eskalationsZeile, wartetAufMensch } = await lib("eskalation.mjs");
const { lies: liesEinstellungen } = await lib("einstellungen.mjs");
const { BETREIBER } = await lib("view.mjs");
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

const { ereignisse, ohneUhr, politik } = eskalationen(liste, { einstellungen, betreiber: BETREIBER });
const wartend = liste.filter((x) => wartetAufMensch(x, { betreiber: BETREIBER })).length;
const eskaliert = ereignisse.filter((e) => e.stufe === 2);
const erinnert = ereignisse.filter((e) => e.stufe === 1);

process.stdout.write(`wartend auf einen Menschen: ${wartend} · Schwellen ${politik.erinnerung_nach} / ${politik.eskalation_nach}\n`);
for (const e of ereignisse) process.stdout.write(`${eskalationsZeile(e)}\n`);
for (const o of ohneUhr) process.stdout.write(`OHNE UHR · ${o.id} · wartet, aber keine Zeile sagt seit wann — \`set <ID> --wartet-auf … --reason …\` · ${o.title}\n`);

if (eskaliert.length === 0 && ohneUhr.length === 0) {
  if (erinnert.length === 0) process.stdout.write("still · nichts ueber der Erinnerungsschwelle\n");
  process.exit(OK);
}
process.stdout.write(
  `\nBEFUND · ${eskaliert.length} eskaliert, ${ohneUhr.length} ohne Uhr. Dieser Posten setzt nichts:\n`
  + "  ESKALATION heisst, der Verteiler sagt es im Chat — und traegt bei_schweigen selbst ein.\n",
);
process.exit(BEFUND);
