#!/usr/bin/env node
// atomar-posten: verfahren
// Gehoert zum Verfahren und wird in fremde Projekte mitgeliefert (T-131).
// MISST: ob jede Rueckfrage (D-/F-Eintrag) ihr Gewicht traegt und es stimmt — severity ab stichtag_gewicht, bei_schweigen: vorgabe nur mit Empfehlung und unterhalb der Grenze, Wortlaut nicht schwerer als das Feld, Antwort unter strategie_grenze vom Strategie Agenten (mit Marke) oder Joachim, darueber von Joachim (oder sein Wort aus dem Chat), ein D-Eintrag oberhalb der Grenze ab stichtag_strategie mit der Marke STRATEGIE geprueft; unlesbare Rueckfrage = Befund.
// TAKT: im Gate (gate-core.sh) und auf Zuruf.
// AUSLOESER: ein D-/F-Eintrag ohne oder mit falschem Gewicht.
// REPARATUR: `set <ID> --severity … [--bei-schweigen …]` beim Fragenden; Altbestand vor dem Stichtag bleibt, wie er ist.
// ZUSTAENDIG: wer die Frage gestellt hat; den Posten faehrt der Verteiler.
/*
 * WACHTPOSTEN: TRAEGT JEDE RUECKFRAGE IHR GEWICHT — UND STIMMT ES? (T-469)
 *
 * D-111 Baustein 1, uebersetzt aus dem Askback-Motor
 * apps/atomar/lib/atomar/askback/policy.ts (Protokoll .atomar/copilot_protocol.md § 1).
 * Dort entschied ein MODUS je Sitzung, ab welchem Gewicht gefragt wird.
 * In Dateiform gibt es einen Modus, und das ist die Regel
 * `eine-rueckfrage-traegt-ihr-gewicht`: bis `blocks-feature` darf der
 * Verteiler antworten, ab `blocks-task` der Betreiber.
 *
 * GEMESSEN am 16.09.2026: 3 offene D-Eintraege, alle beim Betreiber, keiner
 * mit Gewicht; 14 Aufgaben mit `wartet_auf: entscheidung`. Ob eine Frage
 * dem Verteiler zusteht, entschied das Gefuehl — und Regel 27 in Prosa.
 *
 * ── SIEBEN BEDINGUNGEN, JEDE FUER SICH ROT ───────────────────────────
 *
 *   (a) FEHLT     severity fehlt oder ist kein bekanntes Wort — nur ab dem
 *                 Stichtag `stichtag_gewicht` in einstellungen.md; der
 *                 Altbestand wird GEZAEHLT, nicht gemeldet. Ohne Stichtag
 *                 gilt (a) fuer niemanden — ein Posten, der am ersten Tag
 *                 den ganzen Bestand rot meldet, wird ueberlesen.
 *   (b) LEER      bei_schweigen: vorgabe ohne recommendation.
 *                 (Weist `validate()` die Datei schon beim Lesen ab, kommt sie
 *                 als UNLESBAR — gemeldet, nicht verschluckt.)
 *   (c) GRENZE    bei_schweigen: vorgabe bei severity >= blocks-task — die
 *                 Vorgabe naehme dem Betreiber die Entscheidung ab.
 *   (d) UNTER     der WORTLAUT (title + question) verraet ein hoeheres
 *                 Gewicht als das Feld sagt: die drei Regex aus
 *                 policy.ts:89-95 (`gewichtAusText`). Eine Frage, die
 *                 „force push" sagt und `optional` traegt, ist untergewichtet.
 *   (e) URHEBER   zweistufig (T-490, D-114 A): eine Antwort UNTER
 *                 strategie_grenze muss vom Strategie Agent stammen (oder
 *                 von Joachim); eine Antwort DARUEBER (>= naechste Stufe)
 *                 muss von Joachim stammen — es sei denn, die Zeile traegt
 *                 sein Wort aus dem Chat (Regel
 *                 `die-chat-freigabe-ist-eine-eigene-art`: Name + „Chat" im
 *                 Text). Regel `freigabe-holt-man-sich-selbst`: „Gueltig ist
 *                 sie nur, wenn das System ihn als Urheber der Antwort fuehrt."
 *   (f) MARKE     eine Antwort des Strategie Agenten unter der Grenze ohne
 *                 die Log-Zeile `STRATEGIE entschieden · …` (Protokoll § 6) —
 *                 der Name allein beweist nicht, dass Alternativen genannt
 *                 und Joachim informiert wurde.
 *   (g) UNGEPRUEFT ein D-Eintrag AB `stichtag_strategie`, dessen Gewicht
 *                 OBERHALB der Grenze liegt (geht an Joachim), ohne die
 *                 Log-Zeile `STRATEGIE geprueft · …` — Altbestand vor dem
 *                 Stichtag wird gezaehlt, nicht gemeldet (wie (a)).
 *
 * (b) und (c) prueft `validate()` beim Schreiben ebenfalls — hier noch
 * einmal, weil ein von Hand geschriebener Kopf an `validate()` vorbeikommt
 * und weil ein Posten, der sich auf den Schreibweg verlaesst, nichts misst.
 *
 * ── ER MELDET, ER SETZT NICHT ────────────────────────────────────────
 *
 * Ein untergewichtetes Feld wird nicht heimlich angehoben: Wer das Gewicht
 * gesetzt hat, hat sich etwas dabei gedacht — oder nicht, und dann soll er
 * es sehen. Drei Zustaende wie jeder Posten: 0 still, 1 BEFUND, 2 konnte
 * nicht laufen.
 *
 *   node .atomar/wachtposten/pruefe-entscheidung.mjs
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
const { SEVERITIES, GEWICHT_GRENZE, naechsteStufe, gewichtRang, gewichtAusText, urheber } = await lib("entry.mjs");
const { logZeilen } = await lib("timeline.mjs");
const { lies: liesEinstellungen } = await lib("einstellungen.mjs");
const { BETREIBER, STRATEGIE_AGENT } = await lib("view.mjs");
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
const STICHTAG = einstellungen.stichtag_gewicht ?? null;
/*
 * T-489, D-114 A: die Grenze war hier `GEWICHT_GRENZE`, fest getippt —
 * jetzt aus `strategie_grenze` (`.atomar/einstellungen.md`) abgeleitet,
 * damit dieser Posten dieselbe Grenze misst, die `validate()` beim
 * Schreiben durchsetzt (siehe store.mjs `gewichtGrenzeAus`).
 */
const GRENZE = naechsteStufe(einstellungen.strategie_grenze ?? GEWICHT_GRENZE);
/* T-490, D-114 A: ab wann (g) UNGEPRUEFT misst — Altbestand davor wird gezaehlt. */
const STICHTAG_STRATEGIE = einstellungen.stichtag_strategie ?? null;

/**
 * Die Pruefung, getrennt vom Lesen — damit die Gegenprobe sie mit einem
 * Eintrag fuettern kann, ohne einen Baum zu bauen. Liefert je Eintrag
 * die Liste seiner Befunde (leer = in Ordnung) und ob er Altbestand ist.
 */
const MARKE_ENTSCHIEDEN = /^STRATEGIE entschieden\b/;
const MARKE_GEPRUEFT = /^STRATEGIE gepr(?:ü|ue)ft\b/;

function befunde({ entry, body }, {
  stichtag = STICHTAG, betreiber = BETREIBER, strategieAgent = STRATEGIE_AGENT, grenze = GRENZE,
  stichtagStrategie = STICHTAG_STRATEGIE,
} = {}) {
  const aus = [];
  const vorStichtag = !stichtag || String(entry.created_at ?? "").slice(0, 10) < stichtag;
  const sev = entry.severity;
  if (sev === undefined || !SEVERITIES.includes(sev)) {
    if (!vorStichtag) aus.push(`FEHLT · severity ${sev === undefined ? "fehlt" : "ist " + JSON.stringify(sev)} — ${SEVERITIES.join(" | ")}`);
    return { aus, altbestand: vorStichtag && sev === undefined, ungeprueftAltbestand: false };
  }
  if (entry.bei_schweigen === "vorgabe") {
    if (entry.recommendation === undefined) aus.push("LEER · bei_schweigen: vorgabe ohne recommendation — es gibt nichts, das gelten koennte");
    if (grenze !== null && gewichtRang(sev) >= gewichtRang(grenze)) {
      aus.push(`GRENZE · bei_schweigen: vorgabe bei severity ${sev} — ab ${grenze} entscheidet ${betreiber}, nicht die Frist`);
    }
  }
  const mindest = gewichtAusText(`${entry.title ?? ""} ${entry.question ?? ""}`);
  if (mindest !== null && gewichtRang(mindest) > gewichtRang(sev)) {
    aus.push(`UNTER · der Wortlaut verraet ${mindest}, das Feld sagt ${sev}`);
  }
  // T-490, D-114 A: unter der Grenze antwortet der Strategie Agent (oder
  // Joachim), darueber Joachim allein — zwei getrennte Erwartungen, nicht
  // mehr „jeder darf unter der Grenze".
  const unterDerGrenze = grenze === null || gewichtRang(sev) < gewichtRang(grenze);
  if (entry.answer !== undefined) {
    const zeilen = logZeilen(body ?? "");
    const antworten = zeilen.filter((z) => /^answered:/.test(z.text));
    const letzte = antworten[antworten.length - 1];
    if (!letzte) {
      aus.push(`URHEBER · answer gesetzt, aber keine \`answered:\`-Zeile im Log — wer hat geantwortet?`);
    } else {
      const wer = urheber(letzte.wer);
      if (unterDerGrenze) {
        if (wer !== strategieAgent && wer !== betreiber) {
          aus.push(`URHEBER · unter der Grenze antwortet ${strategieAgent}, geantwortet hat ${wer}`);
        } else if (wer === strategieAgent && !zeilen.some((z) => MARKE_ENTSCHIEDEN.test(z.text))) {
          aus.push(`MARKE · Antwort des ${strategieAgent} ohne \`STRATEGIE entschieden ·\`-Zeile im Log`);
        }
      } else {
        const ausDemChat = letzte.text.includes(betreiber) && /\bchat\b/i.test(letzte.text);
        if (wer !== betreiber && !ausDemChat) {
          aus.push(`URHEBER · severity ${sev} gehoert ${betreiber}, geantwortet hat ${wer} — ohne sein Wort aus dem Chat gilt das nicht`);
        }
      }
    }
  }
  // (g) UNGEPRUEFT: ein D-Eintrag oberhalb der Grenze braucht die Marke
  // `STRATEGIE geprueft`, bevor er bei Joachim liegt — unabhaengig davon,
  // ob schon geantwortet ist. Nur ab stichtag_strategie gemeldet, wie (a).
  let ungeprueftAltbestand = false;
  if (entry.kind === "decision" && !unterDerGrenze) {
    const geprueft = logZeilen(body ?? "").some((z) => MARKE_GEPRUEFT.test(z.text));
    if (!geprueft) {
      const vorStichtagStrategie = !stichtagStrategie || String(entry.created_at ?? "").slice(0, 10) < stichtagStrategie;
      if (vorStichtagStrategie) ungeprueftAltbestand = true;
      else aus.push(`UNGEPRUEFT · oberhalb der Grenze ohne \`STRATEGIE geprueft ·\`-Zeile im Log`);
    }
  }
  return { aus, altbestand: false, ungeprueftAltbestand };
}

const fragen = liste.filter((x) => x.entry.kind === "decision" || x.entry.kind === "freigabe");
let altbestand = 0;
let ungeprueftAltbestand = 0;
const rot = [];
/*
 * EINE UNLESBARE RUECKFRAGE IST EIN BEFUND, KEIN SCHWEIGEN. Gefunden von
 * der Gegenprobe (b)/(c): `validate()` weist `vorgabe` ohne Empfehlung
 * beim LESEN ab, `store.list` legt die Datei nach `broken` — und der
 * Posten haette sie nie gesehen. Genau der Fall, den er melden soll,
 * waere still gewesen.
 */
for (const b of liste.broken ?? []) {
  if (!/^[DF]-/.test(b.id)) continue;
  rot.push({ id: b.id, title: "(nicht lesbar)", aus: [`UNLESBAR · ${b.reason}`] });
}
for (const x of fragen) {
  const b = befunde(x);
  if (b.altbestand) altbestand += 1;
  if (b.ungeprueftAltbestand) ungeprueftAltbestand += 1;
  if (b.aus.length > 0) rot.push({ id: x.entry.id, aus: b.aus, title: x.entry.title });
}

if (rot.length === 0) {
  if (altbestand > 0 || ungeprueftAltbestand > 0 || !STICHTAG) {
    process.stdout.write(
      `still · ${fragen.length} Rueckfragen, ${altbestand} ohne Gewicht (Altbestand${STICHTAG ? ` vor ${STICHTAG}` : "; kein stichtag_gewicht in .atomar/einstellungen.md — (a) misst niemanden"})` +
      `${ungeprueftAltbestand ? `, ${ungeprueftAltbestand} oberhalb der Grenze ungeprueft (Altbestand${STICHTAG_STRATEGIE ? ` vor ${STICHTAG_STRATEGIE}` : "; kein stichtag_strategie — (g) misst niemanden"})` : ""}\n`,
    );
  }
  process.exit(OK);
}

process.stdout.write(`BEFUND · ${rot.length} Rueckfrage(n) mit falschem Gewicht${altbestand ? ` · dazu ${altbestand} Altbestand ohne Gewicht (nicht gemeldet)` : ""}\n`);
for (const r of rot) {
  process.stdout.write(`  ${r.id}  ${r.title}\n`);
  for (const a of r.aus) process.stdout.write(`    ${a}\n`);
}
process.stdout.write(
  "\n  Dieser Posten setzt nichts. Wer das Gewicht gesetzt hat, sieht es hier —\n"
  + "  und traegt es nach: `set <ID> --severity … [--bei-schweigen …]`.\n",
);
process.exit(BEFUND);
