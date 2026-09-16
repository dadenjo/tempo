/*
 * DER ANLAUF EINES POSTENS (T-131).
 *
 * Gemessen am 10.09.2026 in einem frischen fremden Projekt -- git, ein
 * Commit, kein `origin`, kein `.atomar`, kein `gh`:
 *
 *   zahlen.sh                     Exit 0    ein Bericht aus lauter Nullen
 *   pruefe-regelblock.mjs         Exit 1    Node-Stapelabzug, relativer Pfad
 *   pruefe-kennungen.mjs          Exit 2    gits eigener Text
 *   pruefe-unveroeffentlicht.mjs  Exit 2    gits eigener Text
 *
 * `zahlen.sh` war der schlimmste Fall: Ein Projekt ohne `origin` sah aus wie
 * ein gesundes ohne Regeln, samt Zahlen, damit man sie glaubt. Und der
 * zweite war der eigene Posten -- er stuerzte mit Exit 1 ab, und 1 heisst in
 * seinem Wortschatz BEFUND. Ein Absturz war von einem Fund nicht zu
 * unterscheiden, und beide sahen aus wie "die Wache hat gearbeitet".
 *
 * DREI ZUSTAENDE, DREI ZAHLEN. Das ist die ganze Datei:
 *
 *   0  alles in Ordnung
 *   1  BEFUND -- die Wache hat etwas gefunden
 *   2  KONNTE NICHT LAUFEN -- eine Voraussetzung fehlt
 *
 * Wer 1 fuer beides benutzt, hat die Unterscheidbarkeit gebaut und an der
 * letzten Stelle wieder verloren.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const OK = 0;
export const BEFUND = 1;
export const NICHT_GELAUFEN = 2;

/**
 * Bricht ab, weil eine Voraussetzung fehlt — mit einem SATZ, nicht mit der
 * Fehlermeldung des Werkzeugs darunter.
 *
 * `fatal: 'origin' does not appear to be a git repository` nennt die
 * Ursache und verschweigt, dass dieser Posten ueberhaupt Voraussetzungen
 * HAT. Wer das liest, sucht einen Fehler; wer den Satz liest, weiss, was er
 * einrichten muss.
 */
export function abbruch(fehlt, hinweis = null) {
  process.stderr.write(`KONNTE NICHT LAUFEN · ${fehlt}\n`);
  if (hinweis) process.stderr.write(`  ${hinweis}\n`);
  process.exit(NICHT_GELAUFEN);
}

/** Die Projektwurzel, aus dem eigenen Ort hergeleitet statt getippt. */
export function wurzel(metaUrl) {
  return process.env.ATOMAR_ROOT
    ?? path.resolve(path.dirname(fileURLToPath(metaUrl)), "..", "..");
}

/** git, still: die Ausgabe oder null. Wirft nie — der Aufrufer sagt, was fehlt. */
export function git(args, cwd) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

/**
 * Wo die Bibliothek des Werkzeugs liegt — oder null.
 *
 * NICHT ueber einen relativen Pfad. Genau daran ist dieser Posten in einem
 * fremden Projekt gescheitert: `../../tools/atomar-backlog/lib/` gibt es nur
 * hier. Ein fremdes Projekt hat das Werkzeug per npm, an einer anderen
 * Stelle -- oder gar nicht, und dann ist das eine Auskunft und kein Absturz.
 */
export function werkzeug(root) {
  const orte = [
    process.env.ATOMAR_WERKZEUG,
    path.join(root, "tools", "atomar-backlog", "lib"),
    path.join(root, "node_modules", "@atomar", "backlog", "lib"),
    path.join(root, "node_modules", "atomar-backlog", "lib"),
  ].filter(Boolean);
  for (const o of orte) {
    if (fs.existsSync(path.join(o, "rules.mjs"))) return o;
  }
  return null;
}

/**
 * Die uebliche Voraussetzung: ein git-Baum mit `origin/main`.
 * Gibt den Namen dessen zurueck, was FEHLT — oder null, wenn alles da ist.
 */
export function fehlendesGit(root) {
  if (git(["rev-parse", "--git-dir"], root) === null) return "kein git-Verzeichnis";
  if (git(["rev-parse", "--verify", "origin/main"], root) === null) return "kein `origin/main`";
  return null;
}

/** Liegt ein Programm auf dem Pfad? Fuer Posten, die `gh` oder `curl` rufen. */
export function aufDemPfad(name) {
  try {
    execFileSync("command", ["-v", name], { stdio: "ignore", shell: true });
    return true;
  } catch {
    return false;
  }
}
