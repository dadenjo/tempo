#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// EINTRAEGE, DIE OFFEN DASTEHEN, OBWOHL IHRE ARBEIT GEMERGT IST.
//
// Der Anlass, 06.09.2026: In einer Nacht habe ich SECHSMAL Arbeit
// zugewiesen, die schon getan war — zweimal von mir selbst gemergt,
// wenige Minuten vorher. Jedes Mal habe ich das Gespraech gelesen statt
// den Bestand, und jedes Mal hat es eine Sitzung gekostet, die
// nachgesehen hat, was ich haette nachsehen muessen.
//
// Eine Regel dagegen gibt es seit gestern (Rang 38). Sie hat nicht
// gereicht: Sie verlangt einen Handgriff in dem Moment, in dem man
// glaubt, ihn nicht zu brauchen. Deshalb hier die Maschine.
//
// WAS ER MISST: Fuer jeden Eintrag, der nicht `done` ist, ob seine
// Kennung in einem GEMERGTEN Pull Request vorkommt. Ein Treffer heisst
// nicht immer "fertig" — ein Eintrag kann mehrere PRs haben. Er heisst:
// SIEH NACH, BEVOR DU IHN VERTEILST.
//
// ER IST KEIN LAUFENDER POSTEN, SONDERN EIN HANDGRIFF VOR DEM
// VERTEILEN. Auch verengt meldet er ein Dutzend Eintraege — die meisten
// zu Recht: gebaut, aber bewusst noch nicht ausgerollt. Als Meldung alle
// dreissig Minuten waere das Rauschen; vor einer Zuweisung ist es genau
// die Liste, die man braucht.
//
//   node .atomar/wachtposten/pruefe-erledigt.mjs
//
// WAS ER NICHT FINDET, und das gehoert dazugesagt: Er sucht die Kennung
// im TITEL des PR. Wer Arbeit unter einem Titel einreicht, der den
// Eintrag nicht nennt, bleibt unsichtbar. Am 06.09. war T-031 genau so
// ein Fall — der Hauptteil lag seit dem 04.09. auf `main`, unter einem
// PR, dessen Titel die Kennung nicht trug; gefunden hat es die Sitzung
// mit einer eigenen Suche im Code.
//
// Ein STILLES Ergebnis heisst also: "kein Treffer in den Titeln", nicht
// "nichts getan". Der Handgriff bleibt: im Zielcode nachsehen, bevor
// ein Auftrag rausgeht.
//
// GEGENPROBE (sie laeuft mit, jedes Mal): Kommen weniger als fuenf
// Kennungen ueberhaupt in gemergten PRs vor, stimmt etwas mit der
// Abfrage nicht und der Posten bricht ab, statt Entwarnung zu geben.
// Ein Posten, der nichts findet, weil er nichts sieht, ist der stille
// Fehlschlag, gegen den er gebaut ist.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { abbruch, aufDemPfad, fehlendesGit } from "./_anlauf.mjs";


// TITEL UND UEBERSCHRIFTEN — der gemessene Mittelweg.
//
//   nur Titel        12 Treffer, aber T-031 uebersehen (Hauptteil lag
//                    seit dem 04.09. auf `main`, unter einem Titel, der
//                    die Kennung nicht trug)
//   Titel + Rumpf    22 Treffer, darunter jeder Eintrag, den ein
//                    fremder PR nur als ZUSAMMENHANG nennt — Rauschen
//   Titel + H-Zeilen  <- hier
//
// Der Grund, dass die mittlere Fassung taugt: Eine Ueberschrift im
// PR-Text sagt „hierueber handelt dieser Abschnitt". Eine Erwaehnung im
// Fliesstext sagt „das gibt es auch noch". PR 1654 trug T-031 als
// `## Eine Kontaktadresse in allen Rechtstexten (T-031)`.
function ueberschriften(pr) {
  const zeilen = (pr.body ?? "").split("\n").filter((z) => /^#{1,6}\s/.test(z));
  return `${pr.title}\n${zeilen.join("\n")}`;
}

// Hergeleitet, nicht getippt (T-131).
const WURZEL = process.env.ATOMAR_ROOT
  ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/*
 * ANLAUF VOR DER MESSUNG (T-131). Dieser Posten braucht ZWEI Dinge, und
 * jedes fehlt fuer sich: einen git-Baum mit origin/main, und `gh`. Ohne
 * `gh` sagte er bisher "gh pr list ging nicht" mitten im Lauf -- das ist
 * gits bzw. ghs Sicht auf die Sache und nicht die fehlende Voraussetzung.
 */
const FEHLT = fehlendesGit(WURZEL) ?? (aufDemPfad("gh") ? null : "das Programm `gh` liegt nicht auf dem Pfad");
if (FEHLT !== null) {
  abbruch(FEHLT, "Dieser Posten vergleicht erledigte Eintraege gegen die PRs auf GitHub.");
}
const BACKLOG = path.join(WURZEL, ".atomar", "backlog");

let prs;
try {
  prs = JSON.parse(execFileSync("gh", [
    "pr", "list", "--state", "merged", "--limit", "200",
    "--json", "number,title,body,mergedAt",
  ], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }));
} catch (e) {
  console.error(`FEHLER: gh pr list ging nicht — ${e.message.split("\n")[0]}`);
  process.exit(2);
}

const alleKennungen = [...new Set([...prs.map(ueberschriften).join("\n").matchAll(/\b([TD]-\d{3})\b/g)].map((m) => m[1]))];

if (alleKennungen.length < 5) {
  console.error(`FEHLER: nur ${alleKennungen.length} Kennungen in ${prs.length} gemergten PRs gefunden.`);
  console.error("Zu wenige, um zu glauben, dass die Suche funktioniert — kein Befund ist hier kein Ergebnis.");
  process.exit(2);
}

const treffer = [];
for (const datei of readdirSync(BACKLOG).filter((f) => f.endsWith(".md"))) {
  const id = datei.replace(/\.md$/, "");
  const inhalt = readFileSync(`${BACKLOG}/${datei}`, "utf8");
  const status = (inhalt.match(/^status: *(.+)$/m) ?? [])[1]?.trim();
  if (!status || status === "done" || status === "closed") continue;
  // NUR DER TITEL ZAEHLT, und das ist gemessen: Ueber Titel UND Rumpf
  // meldete dieser Posten 22 Eintraege — darunter jeden, den ein anderer
  // PR nur als Zusammenhang NENNT. Zweiundzwanzig Zeilen alle dreissig
  // Minuten sind kein Posten, sondern Rauschen, und Rauschen klickt man
  // weg. Der Titel dagegen sagt, WORAN gearbeitet wurde.
  const pr = prs.find((p) => new RegExp(`\\b${id}\\b`).test(ueberschriften(p)));
  if (pr) {
    const titel = (inhalt.match(/^title: *(.+)$/m) ?? [])[1]?.trim().replace(/^"|"$/g, "") ?? "";
    treffer.push(`${id} [${status}] · PR #${pr.number} gemergt ${pr.mergedAt?.slice(0, 16)} · ${titel.slice(0, 70)}`);
  }
}

if (treffer.length === 0) {
  console.log(`STILL · kein offener Eintrag mit gemergter Arbeit (${alleKennungen.length} Kennungen geprueft).`);
  process.exit(0);
}
for (const t of treffer) console.log(`SCHON GETAN? · ${t}`);
process.exit(1);
