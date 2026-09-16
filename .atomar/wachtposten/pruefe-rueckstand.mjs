#!/usr/bin/env node
// atomar-posten: verfahren
// Haengt an KEINEM Projekt: jedes git-Repo mit mehreren Arbeitsbaeumen hat
// diese Falle. Wird mitgeliefert.
/*
 * WACHTPOSTEN: LIEST HIER JEMAND EINEN STAND, DEN ES NICHT MEHR GIBT? (T-245)
 *
 * GEMESSEN am 10.09.2026, und es hat an einem Tag zweimal zugeschlagen:
 *
 *   3 Agent meldete, der Satz „That one didn't reach us" existiere im ganzen
 *   Quelltext nicht. Er existierte — umfrageAntwort.ts:190. Der Hauptcheckout
 *   lag 687 Commits zurueck; die Datei hat dort 192 Zeilen, auf `main` 434.
 *   Der Verteiler erklaerte den Fehler daraufhin mit „falsche App durchsucht" —
 *   auch das war falsch. Zwei Fehlschluesse uebereinander, beide mit Exit 0.
 *
 * Wenige Stunden spaeter waren es 718. Der Rueckstand waechst, waehrend
 * gearbeitet wird.
 *
 * ── WAS DIESEN FALL SO TUECKISCH MACHT ───────────────────────────────
 *
 * `.atomar/` im Hauptcheckout ist AKTUELL, weil `sichern` es staendig
 * nachzieht. Der Quelltext ist es nicht. Eine Sitzung liest dort ein
 * frisches Backlog und zwei Zeilen weiter wochenalten Code — und nichts
 * warnt, weil der Befehl ja lief.
 *
 * ── WANN GEMELDET WIRD, UND WARUM NICHT EINFACH „HINTER origin/main" ──
 *
 * Ein Feature-Baum liegt hinter `origin/main`, das ist sein Zweck. Ihn zu
 * melden waere Laerm, und Laerm wird ueberlesen — dann wird auch die eine
 * echte Meldung ueberlesen.
 *
 * Gefaehrlich ist der Baum, der BEHAUPTET, aktuell zu sein: einer, der auf
 * `main` steht (oder losgeloest auf einem alten `main`), waehrend
 * `origin/main` weitergezogen ist. Der sieht aus wie die Wahrheit. Genau
 * darauf meldet dieser Posten, und auf nichts sonst.
 *
 * ── DIE ZAHL GEHOERT IN DIE MELDUNG ──────────────────────────────────
 *
 * „liegt zurueck" liest sich wie eine Formalie. „718 Commits, aeltester
 * fehlender vom 07.09." nicht. Beides wird gemeldet: die Anzahl sagt, wie
 * viel fehlt, das Alter sagt, wie falsch das Gelesene sein kann.
 *
 * ── UND ER MISST NUR, WAS ER WEISS ───────────────────────────────────
 *
 * Verglichen wird gegen das LOKAL bekannte `origin/main`. Es wird NICHT
 * geholt: ein Posten, der im Baum eines anderen ins Netz greift, hat eine
 * Nebenwirkung, und Nebenwirkungen gehoeren nicht in eine Wache. Ist der
 * Verweis selbst alt, ist die gemeldete Zahl eine UNTERGRENZE — und das
 * steht dann auch da, statt sie als genau auszugeben.
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { OK, BEFUND, abbruch, wurzel, git } from "./_anlauf.mjs";

const WURZEL = wurzel(import.meta.url);

/** Ab wie vielen fehlenden Commits gemeldet wird. Eins ist schon eins. */
const SCHWELLE = Number(process.env.ATOMAR_RUECKSTAND_SCHWELLE ?? 1);

if (git(["rev-parse", "--git-dir"], WURZEL) === null) {
  abbruch("kein git-Verzeichnis", `Gesucht in ${WURZEL}.`);
}
if (git(["rev-parse", "--verify", "origin/main"], WURZEL) === null) {
  abbruch(
    "kein `origin/main`",
    "Ohne Vergleichspunkt ist kein Rueckstand messbar. Das ist eine Auskunft, kein Befund.",
  );
}

/** Alle Arbeitsbaeume dieses Repos — der Hauptcheckout ist der erste. */
function baeume() {
  const roh = git(["worktree", "list", "--porcelain"], WURZEL);
  if (roh === null) return [];
  const aus = [];
  let jetzt = null;
  for (const zeile of roh.split("\n")) {
    if (zeile.startsWith("worktree ")) {
      if (jetzt) aus.push(jetzt);
      jetzt = { pfad: zeile.slice(9), zweig: null, losgeloest: false };
    } else if (zeile.startsWith("branch ")) {
      jetzt.zweig = zeile.slice(7).replace(/^refs\/heads\//, "");
    } else if (zeile.trim() === "detached") {
      jetzt.losgeloest = true;
    }
  }
  if (jetzt) aus.push(jetzt);
  return aus;
}

/*
 * BEHAUPTET DIESER BAUM, AKTUELL ZU SEIN?
 *
 * Ja bei `main`. Und ja bei einem LOSGELOESTEN Kopf, der auf einem Commit
 * sitzt, welcher zu `origin/main` gehoert — das ist ein Wegwerf-Baum „auf
 * main", und genau so werden Release-Pruefungen gefahren. Ein Feature-Zweig
 * behauptet nichts und wird uebergangen.
 */
function behauptetAktuell(baum) {
  if (baum.zweig === "main") return true;
  if (!baum.losgeloest) return false;
  return git(["merge-base", "--is-ancestor", "HEAD", "origin/main"], baum.pfad) !== null;
}

const ziel = git(["rev-parse", "origin/main"], WURZEL);
const zielAlter = git(["log", "-1", "--format=%cI", "origin/main"], WURZEL);

const befunde = [];
for (const baum of baeume()) {
  if (!behauptetAktuell(baum)) continue;
  const zahl = git(["rev-list", "--count", "HEAD..origin/main"], baum.pfad);
  if (zahl === null) continue;
  const n = Number(zahl);
  if (!Number.isFinite(n) || n < SCHWELLE) continue;
  /*
   * DER AELTESTE FEHLENDE COMMIT sagt, wie alt das Gelesene sein kann.
   *
   * NICHT `log -1 --reverse`: `-1` begrenzt VOR dem Umdrehen, man bekommt
   * also den NEUESTEN. Bei 727 fehlenden Commits meldete dieser Posten
   * darum "aeltester fehlender Commit ist 0 h alt" — eine Zahl, die
   * plausibel aussieht und das Gegenteil dessen sagt, wofuer sie da ist.
   * Gefunden am eigenen ersten Lauf, weil 0 h neben 727 nicht zusammenpasst.
   */
  const alle = git(["log", "--format=%cI", "HEAD..origin/main"], baum.pfad);
  const aeltester = alle ? alle.split("\n").filter(Boolean).pop() ?? null : null;
  befunde.push({ ...baum, n, aeltester });
}

if (befunde.length === 0) process.exit(OK);

const tage = (iso) => {
  if (!iso) return null;
  const ms = Date.now() - Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const h = ms / 3600000;
  return h < 48 ? `${Math.round(h)} h` : `${Math.round(h / 24)} Tage`;
};

process.stdout.write(`BEFUND · ${befunde.length} Arbeitsbaum/-baeume geben sich als aktuell aus und sind es nicht\n`);
for (const b of befunde) {
  const alt = tage(b.aeltester);
  process.stdout.write(
    `  ${b.pfad}\n`
    + `    ${b.n} Commits hinter origin/main`
    + `${b.zweig ? ` · Zweig ${b.zweig}` : " · losgeloest"}`
    + `${alt ? ` · aeltester fehlender Commit ist ${alt} alt` : ""}\n`,
  );
}
process.stdout.write(
  `\n  Verglichen gegen den LOKAL bekannten Stand von origin/main (${ziel?.slice(0, 9) ?? "?"}`
  + `${zielAlter ? `, ${tage(zielAlter)} alt` : ""}).\n`
  + `  Wurde laenger nicht geholt, ist die Zahl eine UNTERGRENZE.\n`
  + `\n  Das ist kein Auftrag, diese Baeume zu aktualisieren — sie tragen\n`
  + `  unversionierte Arbeit anderer Sitzungen. Es ist eine Warnung an den,\n`
  + `  der dort Quelltext LIEST: was du dort siehst, ist nicht der Stand.\n`,
);
process.exit(BEFUND);
