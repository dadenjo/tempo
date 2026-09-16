#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// EINTRAEGE, DIE ES NUR AUF DIESER PLATTE GIBT.
//
// Der Anlass, 06.09.2026: Beim Nachmessen des Hauptcheckouts fanden sich
// VIER Backlog-Eintraege, die in keinem Commit existierten — T-093,
// T-095, T-096, T-101 — und dreizehn weitere mit Logzeilen, die nie
// veroeffentlicht waren. Alle Sitzungen schreiben in DENSELBEN
// Arbeitsbaum; wer seine Zeile nicht selbst pusht, hat sie nur hier.
//
// DAS IST DER VERLUST AUS T-075 IN ZEITLUPE. Dort verschwand ein
// Eintrag beim Zusammenfuehren zweier Baeume. Hier verschwaende er beim
// naechsten `reset`, beim naechsten Plattenschaden, oder einfach, weil
// ihn nie jemand mitgenommen hat — und niemand wuerde es merken, weil
// die ANSICHT ihn zeigt. Die Ansicht liest den Arbeitsbaum, nicht das
// Archiv.
//
// WAS ER MELDET:
//   NUR LOKAL  — die Datei existiert in origin/main gar nicht
//   UNGESICHERT — sie existiert, aber traegt hier Logzeilen mehr
//
// WAS ER NICHT SIEHT, und das gehoert in ihn hinein, weil sein Schweigen
// sonst mehr behauptet, als es traegt:
//
//   1. Er liest den GEMEINSAMEN Arbeitsbaum. Eine Sitzung, die in ihrem
//      EIGENEN Baum einen Eintrag anlegt und direkt pusht, taucht hier
//      nie auf — weder als Fund noch als Luecke.
//   2. Der gemeinsame Baum liegt am 06.09. 179 Commits zurueck. Ein
//      Eintrag, der auf `origin/main` liegt und hier fehlt, ist deshalb
//      NORMAL und kein Befund. Genau das habe ich einmal falsch
//      gemeldet: T-106 lag auf `main`, ich sah in den Baum und schrieb
//      „existiert nur bei dir".
//
// SEIN SCHWEIGEN HEISST ALSO: „Was in diesem Baum liegt, ist
// veroeffentlicht." Es heisst NICHT: „Jeder Eintrag ist veroeffentlicht."
// Der Unterschied ist derselbe wie zwischen „0 failed" und „0 collected".
//
// GEGENPROBE: Findet er keine einzige Datei zum Vergleichen, bricht er
// mit Fehler ab statt Entwarnung zu geben. Ein Posten, der ins Leere
// sieht, ist still — und Stille sieht aus wie Ordnung.

import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync } from "node:fs";
import { abbruch, fehlendesGit } from "./_anlauf.mjs";

// Die Wurzel wird HERGELEITET, nicht getippt: dieser Posten liegt in
// <wurzel>/.atomar/wachtposten/. Ein fest verdrahteter Pfad macht ihn
// fuer jedes andere Projekt unbrauchbar (T-131).
const WURZEL = process.env.ATOMAR_ROOT
  ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/*
 * ANLAUF VOR DER MESSUNG (T-131). Ohne ihn endete dieser Posten in einem
 * fremden Projekt zwar mit 2 -- richtig --, aber die erste Zeile war gits
 * eigener Text: "fatal: 'origin' does not appear to be a git repository".
 * Der nennt die URSACHE und verschweigt, dass dieser Posten ueberhaupt
 * Voraussetzungen HAT. Wer das liest, sucht einen Fehler; wer den Satz
 * liest, weiss, was er einrichten muss.
 */
const FEHLT = fehlendesGit(WURZEL);
if (FEHLT !== null) {
  abbruch(FEHLT, "Dieser Posten misst gegen origin/main — ohne den Anker misst er nichts.");
}
const ORDNER = ["backlog", "rules"];

try {
  execFileSync("git", ["fetch", "origin", "-q"], { cwd: WURZEL });
} catch (e) {
  console.error(`FEHLER: git fetch ging nicht — ${e.message.split("\n")[0]}`);
  process.exit(2);
}

const logzeile = /^- \d{4}-\d{2}-\d{2}T/;

// ZWEIMAL MESSEN, UND NUR MELDEN, WAS BEIDE MALE DASTEHT.
//
// Der Posten hat am 07.09.2026 zweimal in einer Stunde Alarm geschlagen,
// und beide Male war nichts: Er hat in dem Fenster gemessen, in dem eine
// Sitzung ihre Zeilen schon geschrieben, aber noch nicht veroeffentlicht
// hatte. Sekunden spaeter stand alles auf origin/main.
//
// Das ist kein Fehler im Vergleich — der stimmt. Es ist ein Fehler in der
// AUSSAGE: "ungesichert" heisst hier "seit einer Weile ungesichert", und
// ein Posten, der zweimal die Stunde grundlos ruft, wird beim dritten Mal
// nicht mehr gelesen. Genau dann faellt der echte Fall durch.
//
// Also: aufgefallen -> abwarten -> nachsehen. Was nach der Wartezeit immer
// noch fehlt, fehlt wirklich. Die Sperre wird dadurch nicht schwaecher,
// nur langsamer, und Langsamkeit kostet hier nichts: der Posten laeuft
// ohnehin alle zwanzig Minuten.
const RUHEZEIT_MS = 90_000;

function messen() {
  const befunde = [];
  let verglichen = 0;
  for (const ordner of ORDNER) {
    let dateien;
    try {
      dateien = readdirSync(`${WURZEL}/.atomar/${ordner}`).filter((f) => f.endsWith(".md"));
    } catch { continue; }

    for (const datei of dateien) {
      const pfad = `.atomar/${ordner}/${datei}`;
      let fern;
      try {
        fern = execFileSync("git", ["show", `origin/main:${pfad}`], { cwd: WURZEL, encoding: "utf8" });
      } catch {
        befunde.push(`NUR LOKAL \u00b7 ${pfad} \u2014 existiert in keinem Commit`);
        continue;
      }
      verglichen++;
      const hier = readFileSync(`${WURZEL}/${pfad}`, "utf8");
      const fernZeilen = new Set(fern.split("\n").filter((z) => logzeile.test(z)));
      const neue = hier.split("\n").filter((z) => logzeile.test(z) && !fernZeilen.has(z));
      if (neue.length > 0) {
        befunde.push(`UNGESICHERT \u00b7 ${pfad} \u2014 ${neue.length} Logzeile(n) nur hier`);
      }
    }
  }
  return { befunde, verglichen };
}

let { befunde, verglichen } = messen();

if (befunde.length > 0) {
  await new Promise((r) => setTimeout(r, RUHEZEIT_MS));
  try {
    execFileSync("git", ["fetch", "origin", "-q"], { cwd: WURZEL });
  } catch { /* der erste fetch ist durchgegangen; ein Aussetzer hier darf nicht melden */ }
  const zweite = messen();
  // Die Schnittmenge: nur was BEIDE Laeufe gesehen haben. Ein Befund, der
  // beim zweiten Mal weg ist, war eine Sitzung beim Schreiben.
  const nochmal = new Set(zweite.befunde);
  befunde = befunde.filter((b) => nochmal.has(b));
  verglichen = zweite.verglichen;
}

if (verglichen < 20) {
  console.error(`FEHLER: nur ${verglichen} Dateien verglichen — zu wenige, um zu glauben, dass der Vergleich funktioniert.`);
  process.exit(2);
}

if (befunde.length === 0) {
  console.log(`STILL · alles veroeffentlicht (${verglichen} Dateien verglichen).`);
  process.exit(0);
}
for (const b of befunde) console.log(`UNVEROEFFENTLICHT · ${b}`);
process.exit(1);
