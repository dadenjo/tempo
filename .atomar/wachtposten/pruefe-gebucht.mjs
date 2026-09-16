#!/usr/bin/env node
// atomar-posten: verfahren
// Haengt an KEINEM Projekt: jedes Backlog, das neben git gefuehrt wird, hat
// diese Luecke. Wird mitgeliefert.
/*
 * WACHTPOSTEN: STEHT EIN EINTRAG OFFEN, WAEHREND SEIN CODE LAENGST AUF
 * `main` LIEGT? (T-278)
 *
 * GEMESSEN am 10.09.2026 ueber 344 Eintraege: 13 der 32 offenen — 41 % —
 * tragen einen Code-Commit auf `main`, der ihre Nummer als eigenen Bezug
 * nennt. Das ist keine Nachlaessigkeit, sondern Bauart: gebaut wird im
 * Zweig, gemergt mit `gh`, gebucht mit `cli.mjs set`. Drei Werkzeuge, drei
 * Zeitpunkte, und nichts koppelt den dritten an den ersten. Der Merge ist
 * dabei der Moment ohne Zustaendigen — wer baut, ist bei „PR offen" fertig,
 * wer mergt, denkt in PR-Nummern.
 *
 * ── ER MELDET, ER SETZT NICHT ────────────────────────────────────────
 *
 * Ein Commit mit der Nummer ist ein VERDACHT. Bei T-002 steht im Log
 * woertlich „WAS NOCH FEHLT, damit niemand den Eintrag fuer fertig haelt":
 * die Etappe ist gebaut, der Eintrag ist zu Recht offen. Wer die dreizehn
 * automatisch buchte, taeuschte dreizehn veraltete Zeilen gegen dreizehn
 * FALSCHE — und falsche prueft niemand mehr nach.
 *
 * Dieser Posten weiss nicht, ob ein Eintrag fertig IST. Er sagt einen Satz:
 * hier widersprechen sich zwei Quellen.
 *
 * ── UND ER MISST NUR, WAS ER WEISS ───────────────────────────────────
 *
 * Verglichen wird gegen das LOKAL bekannte `origin/main`, ohne zu holen —
 * ein Posten, der im Baum eines anderen ins Netz greift, hat eine
 * Nebenwirkung, und Nebenwirkungen gehoeren nicht in eine Wache.
 */

import { OK, BEFUND, abbruch, wurzel, fehlendesGit, werkzeug } from "./_anlauf.mjs";

const WURZEL = wurzel(import.meta.url);

const fehlt = fehlendesGit(WURZEL);
if (fehlt) {
  abbruch(fehlt, "Ohne Vergleichspunkt ist kein Widerspruch messbar. Das ist eine Auskunft, kein Befund.");
}

const LIB = werkzeug(WURZEL);
if (LIB === null) {
  abbruch(
    "das Backlog-Werkzeug ist nicht auffindbar",
    "Gesucht in tools/atomar-backlog/lib und in node_modules. Ohne es gibt es keine Eintraege zu pruefen.",
  );
}

const { widersprueche } = await import(new URL("git.mjs", "file://" + LIB + "/"));
const { wartetAufErledigtes, WARTET_AUF_NICHTS } = await import(new URL("wartet.mjs", "file://" + LIB + "/"));
const store = await import(new URL("store.mjs", "file://" + LIB + "/"));

let liste;
try {
  liste = await store.list(WURZEL);
} catch (err) {
  abbruch("die Eintraege sind nicht lesbar", String(err?.message ?? err));
}

const treffer = widersprueche(WURZEL, liste.map((x) => x.entry));
if (treffer === null) {
  abbruch("kein `origin/main`", "Ohne Vergleichspunkt ist kein Widerspruch messbar.");
}
/*
 * DIE ZWEITE KLASSE (T-293): wartet auf eine Entscheidung, die laengst
 * gefallen ist — oder auf keine. Dieselbe Bauart: die Zeile blieb
 * stehen, als sich die Welt bewegte. Nur ist es hier eine Entscheidung
 * statt eines Commits, und reine Textlesung statt einer Git-Suche.
 */
const wartend = wartetAufErledigtes(liste);
if (treffer.length === 0 && wartend.length === 0) process.exit(OK);

/** Je Eintrag der JUENGSTE Commit — er ist der, der am ehesten stimmt. */
const jeEintrag = new Map();
for (const t of treffer) if (!jeEintrag.has(t.id)) jeEintrag.set(t.id, t);

const alter = (iso) => {
  const ms = Date.now() - Date.parse(iso ?? "");
  if (!Number.isFinite(ms)) return null;
  const h = ms / 3600000;
  return h < 48 ? `${Math.round(h)} h` : `${Math.round(h / 24)} Tage`;
};

if (jeEintrag.size > 0) process.stdout.write(
  `BEFUND · ${jeEintrag.size} offene(r) Eintrag/Eintraege haben Code auf origin/main\n`,
);
for (const [id, t] of jeEintrag) {
  const a = alter(t.datum);
  process.stdout.write(
    `  ${id}  ${t.sha.slice(0, 9)}${a ? ` · ${a} alt` : ""}\n`
    + `    ${t.betreff}\n`,
  );
}
if (wartend.length > 0) {
  process.stdout.write(
    `${jeEintrag.size > 0 ? "\n" : ""}BEFUND · ${wartend.length} wartende(r) Eintrag/Eintraege, deren Blocker nicht mehr steht\n`,
  );
  for (const w of wartend) {
    process.stdout.write(w.art === WARTET_AUF_NICHTS
      ? `  ${w.id}  wartet auf eine Entscheidung — aber keine D-Nummer im Text\n`
      : `  ${w.id}  wartet auf ${w.entscheidungen.map((d) => d.id).join(", ")} — alle erledigt\n`);
  }
}
process.stdout.write(
  "\n  Ein Commit mit der Nummer ist ein VERDACHT, kein Beleg: gebaut heisst\n"
  + "  nicht fertig. Dieser Posten setzt nichts — er sagt nur, dass zwei\n"
  + "  Quellen sich widersprechen. Nachsehen, dann buchen.\n"
  + "\n  Gegen den LOKAL bekannten Stand von origin/main gemessen, ohne zu holen.\n",
);
process.exit(BEFUND);
