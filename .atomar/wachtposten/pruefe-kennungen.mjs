#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// EINE KENNUNG, DIE BENUTZT WIRD, OHNE VERGEBEN WORDEN ZU SEIN.
//
// Der Anlass, 06.09.2026, zweimal an einem Tag:
//
//   1. 5 Agent NANNTE ihre Arbeit "T-123" und "T-124", ohne Eintraege
//      anzulegen, waehrend 1 HUB dieselben Nummern regulaer vergab. Ein
//      bereits gemergter PR traegt seither die falsche Nummer im Titel.
//   2. 2 Agent schrieb `D-046.md` von Hand. D-046 war seit 20:06 vergeben
//      (Outrun-Biom, ueber die CLI). Die Datei ueberschrieb sie auf `main`,
//      und die anschliessende "Reparatur" von 1 HUB machte es schlimmer.
//
// T-108 hat die Vergabe gegen genau diesen Zusammenstoss gesichert:
// `create()` liest vor der Vergabe `origin/main`, nicht nur das eigene
// Verzeichnis. DIESE SPERRE SCHUETZT DEN WEG DURCH DIE CLI. Eine Datei,
// die daneben von Hand entsteht, sieht sie nie — sie wird nicht VERGEBEN,
// sie wird BENUTZT.
//
// WAS ER MELDET:
//   OHNE KOPF     — die Datei hat keinen YAML-Block, kam also nicht aus
//                   der CLI und hat keine Vergabe hinter sich
//   KENNUNG SCHIEF — `id:` im Kopf und Dateiname widersprechen sich
//
// WARUM DER FEHLENDE KOPF DAS ENTSCHEIDENDE MERKMAL IST: Gemessen am
// 06.09. hatten von 150 Eintraegen auf `main` GENAU ZWEI keinen Kopf —
// und beide entstanden in derselben Stunde von Hand. Einer davon war die
// Kollision. Das Merkmal ist also selten genug, um kein Rauschen zu sein.
//
// UND HIER IST SEINE GRENZE, GEMESSEN AM SELBEN ABEND: 2 Agent hat an
// diesem Tag ZEHN Eintraege von Hand geschrieben und die Nummer mit
// `git ls-tree | tail` geraten. Dieser Posten faende davon ZWEI — die
// anderen acht tragen einen von Hand nachgebauten Kopf und sehen fuer ihn
// aus wie jeder CLI-Eintrag. Er findet also die Nachlaessigsten, nicht
// alle. Sein Schweigen heisst "keine kopflose Datei", nicht "jede Nummer
// wurde vergeben".
//
// WAS ER AUSSERDEM NICHT SIEHT: Zwei Sitzungen, die ueber die CLI in getrennten
// Baeumen dieselbe Nummer ziehen — dagegen steht T-108. Und eine Nummer,
// die nur in einem PR-Titel oder einer Nachricht auftaucht, ohne dass je
// eine Datei entsteht: die hat keine Datei, also auch keinen Kopf, den er
// lesen koennte. Fall 1 oben faende er NICHT.
//
// GEGENPROBE: Findet er zu wenige Dateien, bricht er mit Fehler ab statt
// Entwarnung zu geben. Ein Posten, der ins Leere sieht, ist still — und
// Stille sieht aus wie Ordnung.

import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
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

try {
  execFileSync("git", ["fetch", "origin", "-q"], { cwd: WURZEL });
} catch (e) {
  console.error(`FEHLER: git fetch ging nicht — ${e.message.split("\n")[0]}`);
  process.exit(2);
}

let dateien;
try {
  dateien = execFileSync(
    "git",
    ["ls-tree", "--name-only", "origin/main", ".atomar/backlog/"],
    { cwd: WURZEL, encoding: "utf8" },
  )
    .split("\n")
    .filter((z) => z.endsWith(".md"));
} catch (e) {
  console.error(`FEHLER: konnte origin/main nicht lesen — ${e.message.split("\n")[0]}`);
  process.exit(2);
}

const befunde = [];
let geprueft = 0;

for (const pfad of dateien) {
  const name = pfad.split("/").pop().replace(/\.md$/, "");
  let inhalt;
  try {
    inhalt = execFileSync("git", ["show", `origin/main:${pfad}`], {
      cwd: WURZEL,
      encoding: "utf8",
    });
  } catch {
    continue;
  }
  geprueft++;

  const zeilen = inhalt.split("\n");
  if (zeilen[0].trim() !== "---") {
    befunde.push(`OHNE KOPF · ${pfad} — kein YAML-Block, also nicht ueber die CLI angelegt`);
    continue;
  }
  const ende = zeilen.indexOf("---", 1);
  const kopf = zeilen.slice(1, ende === -1 ? zeilen.length : ende);
  const idZeile = kopf.find((z) => /^id:\s/.test(z));
  if (!idZeile) {
    befunde.push(`OHNE KOPF · ${pfad} — YAML-Block ohne id:`);
    continue;
  }
  const id = idZeile.replace(/^id:\s*/, "").replace(/^["']|["']$/g, "").trim();
  if (id !== name) {
    befunde.push(`KENNUNG SCHIEF · ${pfad} — Kopf sagt "${id}", Datei heisst "${name}"`);
  }
}

if (geprueft < 20) {
  console.error(
    `FEHLER: nur ${geprueft} Eintraege geprueft — zu wenige, um zu glauben, dass die Pruefung funktioniert.`,
  );
  process.exit(2);
}

if (befunde.length === 0) {
  console.log(`STILL · alle Kennungen stimmen (${geprueft} Eintraege geprueft).`);
  process.exit(0);
}

console.log(befunde.join("\n"));
process.exit(1);
