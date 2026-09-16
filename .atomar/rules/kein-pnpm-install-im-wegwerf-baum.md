---
name: kein-pnpm-install-im-wegwerf-baum
title: Kein `pnpm install` in einem Wegwerf-Baum — es schreibt den HAUPTCHECKOUT um
origin: operator
rank: 42
version: 1.0.0
short: "Ein `pnpm install` im Wegwerf-Baum richtet die Workspace-Verweise des Hauptcheckouts auf diesen Baum. Wird er weggeräumt, zeigen sie ins Leere — und jede Sitzung, die auf den Hauptcheckout verlinkt, erbt den Bruch."
---
## Zweimal an einem Tag, derselbe Bruch

**07.09.2026.** Die Workspace-Verweise des Hauptcheckouts zeigten auf einen
Wegwerf-Baum, den es nicht mehr gab:

```
apps/pixel-peloton/node_modules/@pixel-peloton/sensor-bus     → /private/tmp/wt-t157/…   TOT
apps/pixel-peloton/node_modules/@pixel-peloton/shared-config  → /private/tmp/wt-t157/…   TOT
apps/pixel-peloton/node_modules/@atomar/pixel-text            → /private/tmp/wt-t157/…   TOT
```

Repariert, ins Repo gerichtet. **Eine Stunde später dasselbe, nur mit
`wt-t158`.** Zwei verschiedene Bäume, dieselbe Krankheit.

## Der Mechanismus

**`pnpm install` in einem Wegwerf-Baum schreibt die Verweise des
HAUPTCHECKOUTS auf diesen Baum um.** Solange der Baum steht, merkt es
niemand. Wird er entfernt — und Wegwerf-Bäume werden entfernt, dafür sind sie
da —, zeigen sie ins Leere.

**Und der Schaden ist geteilt, nicht lokal:** Jede Sitzung, die nach dem
Rezept `node_modules` des Hauptcheckouts verlinkt, erbt den Bruch. Gemessen:
**36 Typfehler** in einem frischen Baum auf `origin/main`. Vermutlich auch der
Grund für die vierzehn Bäume, in denen `npm test` abbricht — nicht vierzehn
schlecht aufgesetzte Bäume, sondern **ein** geteilter Bruch.

## Die Regel

- **Kein `pnpm install` in einem Wegwerf-Baum.** Verlinke stattdessen, wie es
  `CLAUDE.md` beschreibt — und denk an den Verweis **je App**, siehe
  [[der-verweis-haengt-an-der-app]].
- **Die eine Ausnahme ist `release-check.sh`**, und es ist genau deshalb
  gebaut: Es installiert wirklich, in einem eigenen Baum, weil Turbopack ein
  verlinktes `node_modules` außerhalb des Projektwurzelverzeichnisses
  ablehnt. Es ist die Ausnahme, die die Regel braucht — nicht ihr Gegenbeweis.

## Wenn es doch passiert ist

Ein toter Verweis ist in Sekunden zu finden und zu heilen — **und ohne
`pnpm install`**, das den nächsten Bruch gleich mitliefert:

```bash
find apps/*/node_modules/@*/ -maxdepth 1 -type l ! -exec test -e {} \; -print
# und je Fund: ins Repo richten
ln -sfn ../../../../packages/<pfad> apps/<app>/node_modules/<paket>
```

**Wer ihn findet, darf ihn reparieren, auch wenn es geteilter Zustand ist.**
Ein toter Verweis kann niemandes laufende Arbeit stören: Das Ziel existiert
nicht. Das ist der eine Fall, in dem Anfassen sicherer ist als Melden — und er
unterscheidet sich von allem anderen an geteiltem Zustand genau darin.
