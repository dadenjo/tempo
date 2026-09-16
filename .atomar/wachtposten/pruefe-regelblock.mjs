#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
/*
 * WACHTPOSTEN: TRAEGT CLAUDE.md DIE REGELN, DIE ES GIBT? (T-131)
 *
 * Vom 04.09. bis zum 07.09. stand im Block der Stand von 18 Regeln, waehrend
 * 54 im Baum lagen. SECHSUNDDREISSIG Regeln haben in dieser Zeit keine
 * einzige Sitzung erreicht -- darunter jede, die in diesen drei Tagen
 * entstanden ist.
 *
 * Gemerkt hat es niemand, und das ist der eigentliche Befund: Der Block sah
 * vollstaendig aus. Wir haben uns in dieser Zeit gegenseitig auf Regeln
 * hingewiesen, die es als Datei gab und die in keinem Systemtext standen --
 * und wer sie nicht befolgte, hatte sie nie gesehen.
 *
 * `rules.mjs` begruendet den Block mit dem Satz "Ein Verweis ist keine
 * Ladung". Genau dieselbe Luecke hatte er dann eine Stelle weiter: Es gibt
 * einen Ladeschritt, und niemand fuehrt ihn aus.
 *
 * ER MELDET, ER REPARIERT NICHT. `atomar install` zu laufen ist ein Griff,
 * der den Systemtext JEDER Sitzung aendert -- das gehoert einem Menschen und
 * nicht einem Posten. Eine Datei, die alle lesen, still zu aendern, ist
 * etwas anderes, als einen Eintrag zu committen.
 *
 * GEGENPROBE: Ohne CLAUDE.md oder ohne lesbare Regeln endet er mit FEHLER,
 * nie mit Schweigen. Und er wird ROT, wenn eine Regel dazukommt und niemand
 * `install` laeuft -- nicht nur gruen, wenn alles stimmt.
 */

import fs from "node:fs";
import path from "node:path";

import { BEFUND, OK, abbruch, werkzeug, wurzel } from "./_anlauf.mjs";

/*
 * DAS WERKZEUG WIRD GESUCHT, NICHT GETIPPT (T-131).
 *
 * Bis zum 10.09.2026 stand hier ein RELATIVER Import auf
 * `../../tools/atomar-backlog/lib/` — den gibt es nur in diesem Projekt. In
 * einem fremden stuerzte der Posten mit einem Node-Stapelabzug ab, und der
 * Exit war 1. Eine 1 heisst hier aber BEFUND: Ein Absturz war von einem Fund
 * nicht zu unterscheiden, und beide sahen aus wie "die Wache hat
 * gearbeitet".
 *
 * Jetzt: gefunden -> weiter; nicht gefunden -> Exit 2 mit einem Satz. Die
 * Regel dazu gibt es seit Rang 70 (keine-relativen-pfade-im-geteilten-baum);
 * ich hatte sie an meinem eigenen Posten nicht angewandt.
 */
const WURZEL = wurzel(import.meta.url);
const LIB = werkzeug(WURZEL);
if (LIB === null) {
  abbruch(
    "das Werkzeug `atomar-backlog` ist nicht auffindbar",
    "Gesucht in tools/atomar-backlog/lib und node_modules — oder setze ATOMAR_WERKZEUG.",
  );
}
const { herkunftAusBlock, listRules } = await import(path.join(LIB, "rules.mjs"));
const { abdruckVon } = await import(path.join(LIB, "regelstand.mjs"));

const DATEI = path.join(WURZEL, "CLAUDE.md");

let text;
try {
  text = fs.readFileSync(DATEI, "utf8");
} catch (err) {
  abbruch(`${DATEI} ist nicht lesbar (${err.code ?? err.message})`,
    "Ohne die Datei misst dieser Posten nichts — er wird nicht uebersprungen.");
}

const gelesen = await listRules(WURZEL);
if (gelesen.broken.length > 0) {
  // Eine unlesbare Regeldatei macht jeden Vergleich wertlos: der Abdruck
  // ueber "alles ausser der kaputten" ist eine andere Zahl als der, den
  // `install` schreiben wuerde.
  for (const b of gelesen.broken) console.error(`  ${b.file}: ${b.reason}`);
  abbruch(`${gelesen.broken.length} Regeldatei(en) sind unlesbar`,
    "Der Abdruck waere unvollstaendig — er wuerde eine andere Zahl ergeben als `install`.");
}
if (gelesen.length === 0) {
  abbruch(`keine einzige Regel unter ${path.join(WURZEL, ".atomar/rules")}`,
    "Ohne Regeln gibt es nichts zu vergleichen.");
}

const jetzt = {
  anzahl: gelesen.length,
  abdruck: abdruckVon(gelesen.map(({ rule, body }) => ({ name: rule.name, rank: rule.rank, inhalt: body }))),
};
const imBlock = herkunftAusBlock(text);

if (imBlock === null) {
  /*
   * STUMM IST NICHT FALSCH. Ein Block aus der Zeit vor der Herkunftszeile
   * sagt nichts ueber sich -- er kann trotzdem stimmen. Das als Befund zu
   * melden waere ein Fehlalarm, es zu verschweigen waere eine Entwarnung
   * ohne Messung. Also: ungeprueft, und der Weg dorthin.
   */
  console.log(`UNGEPRUEFT · Der Block in CLAUDE.md nennt seine Herkunft nicht (Fassung vor T-131).`);
  console.log(`  ${jetzt.anzahl} Regeln liegen im Baum. Ob der Block sie traegt, sagt erst ein Lauf:`);
  console.log("  node tools/atomar-backlog/cli.mjs install --yes");
  process.exit(BEFUND);
}

if (imBlock.abdruck === jetzt.abdruck) {
  console.log(`OK · Der Block traegt alle ${jetzt.anzahl} Regeln (Abdruck ${jetzt.abdruck}).`);
  process.exit(OK);
}

const fehlend = jetzt.anzahl - imBlock.anzahl;
console.log("VERALTET · CLAUDE.md traegt nicht den Stand der Regeln.");
console.log(`  im Block:   ${imBlock.anzahl} Regeln, Abdruck ${imBlock.abdruck}`);
console.log(`  im Baum:    ${jetzt.anzahl} Regeln, Abdruck ${jetzt.abdruck}`);
console.log(fehlend > 0
  // Die Zahl, die den Satz traegt: nicht "es weicht ab", sondern wie viele
  // Regeln gerade keine Sitzung erreichen.
  ? `  ${fehlend} Regel(n) erreichen KEINE Sitzung — sie stehen als Datei da und in keinem Systemtext.`
  : "  Gleiche Anzahl, anderer Abdruck: der TEXT einer Regel hat sich geaendert.");
console.log("  Beheben: node tools/atomar-backlog/cli.mjs install --yes");
console.log("  (Das aendert den Systemtext jeder Sitzung — deshalb meldet dieser Posten nur.)");
process.exit(BEFUND);
