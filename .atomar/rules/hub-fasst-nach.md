---
name: hub-fasst-nach
title: "Wer nichts hört, fragt nach — der Hub, nicht der Betreiber"
origin: operator
rank: 275
version: 1.1.0
short: "Der Verteiler holt sich den Stand aktiv: bei jedem Eintrag, der länger still ist als der Nachfass-Takt (Vorgabe 2h) — und bei jedem, der „gar nichts“ oder „nichts angefangen“ zeigt, denn dort läuft keine Uhr. Nicht „bist du fertig?“, sondern: Stand, letzter Push, was fehlt dir?"
---
## Warum es beim Verteiler liegt und nicht beim Schweigenden

Die Meldepflicht der Sitzungen bleibt bestehen. Sie **reicht aber
nicht**: Wer sie vergisst, meldet auch nicht, dass er sie vergessen
hat. Genau darum kann das Nachfragen nicht bei dem liegen, der
schweigt.

Am 04.09.2026 saß eine Sitzung fertig da, ohne sich zu melden —
gemerkt hat es der **Betreiber**, nicht der Verteiler.

## Warum

der Betreiber, 04.09.: *„wenn was länger dauert muss nachgefasst werden durch
den Hub — also mit Kulanz, aber nach einer gewissen Zeit."*

Ohne diese Regel hat Stille keinen Adressaten. Die Marke
„Zwischenstand überfällig" sagt, dass jemand nichts gemeldet hat; sie
sagt nicht, wer deshalb etwas tun muss. Eine Anzeige, die niemandem
gehört, wird von allen gesehen und von keinem beantwortet.

Und sie gehört zum **Hub**, nicht zum Betreiber. Dass an einer Stelle
etwas hakt, soll der Betreiber lesen können — nicht erfragen müssen.

## Die Kulanz ist der Abstand zwischen zwei Zahlen

    zwischenstand_takt: 1h     was der Eigentümer schuldet
    nachfass_takt:      2h     was der Hub schuldet

Eine verpasste Meldung ist noch kein Anlass, jemanden anzusprechen —
zwei sind es. Genau das ist die Kulanz, und sie steht als Zahl da,
statt in jemandes Ermessen zu liegen.

Ein `nachfass_takt` **unter** dem `zwischenstand_takt` wird abgelehnt:
dann fiele das Nachfassen an, bevor die Meldung fällig ist. Das
Werkzeug biegt die beiden Zahlen nicht heimlich gerade.

## Zwei Uhren, und deshalb nichts zum Abhaken

    Meldeschuld   jüngste Zeile DES EIGENTÜMERS      → 1h
    Nachfassen    jüngste Zeile VON IRGENDWEM        → 2h

Fragt der Hub nach, steht seine Zeile im Eintrag. Die zweite Uhr geht
auf null — **die erste nicht**. Eine Nachfrage ist keine Antwort; die
Meldeschuld bleibt beim Eigentümer, wo sie hingehört.

Damit erledigt sich das Nachfassen von selbst, ohne dass es jemand
abhakt. Ein Feld `nachgefasst: true` wäre irgendwann vergessen worden,
und dann stünde daneben, dass alles in Ordnung ist.

## Wer keine Uhr hat, fällt durch beide Takte

Die zwei Uhren fassen nur, was auf `active` steht. Eine Sitzung ohne
laufenden Eintrag hat **keine Uhr, die ablaufen kann** — also keine
Meldeschuld, also nichts nachzufassen. Genau so hat Sitzung 5 am
04.09. drei Stunden gewartet.

Die Antwort ist keine dritte Uhr, sondern zwei **Lagen**. Sie sind
ohne Dauer messbar, und deshalb muss sie jemand **lesen**:

    gar nichts        nichts offen → zuteilen
    nichts angefangen offen, aber nichts auf `active` → fragen,
                      was im Weg steht

Beide stehen im Lagebericht als *Handeln*, nicht als Hinweis, und in
der Übersicht mit dem Zusatz „keine Uhr, die abläuft" — sonst liest
man eine leere Zeile als „alles in Ordnung".

## Wer auf einen Menschen wartet, bekommt zwei Stufen (T-472, D-111 Baustein 4)

Die Takte oben messen Sitzungen. Was auf einen MENSCHEN wartet — eine offene
Entscheidung oder Freigabe, eine Aufgabe mit `wartet_auf: entscheidung|handgriff`,
ein Eintrag bei der Betreiber — hat zwei eigene Zahlen in `einstellungen.md`:
`erinnerung_nach` (Vorgabe 24 h) und `eskalation_nach` (Vorgabe 72 h). Nach der
ersten erinnert der Verteiler im Eintrag, nach der zweiten im Chat — und nennt
dabei, was bei Schweigen geschieht (`bei_schweigen`, Regel
`eine-rueckfrage-traegt-ihr-gewicht`). Gemessen wird von `pruefe-eskalation.mjs`
(im Stillstand-Posten je Durchgang, in der Lage des Startprompts), gemeldet
wird der WECHSEL der Stufe. Es gibt keine dritte Stufe: kein Skript trägt eine
Antwort ein (`auto_resolve` aus dem Motor bleibt draußen, D-105). Die Zahlen
stehen in der Datei, nicht im Posten — ein Posten mit getippter Schwelle ist ein
Posten, den man nicht umstellen kann, ohne ihn zu lesen.

## Was Nachfassen heißt

Die Frage lautet **nicht** „bist du fertig?" — das kann man mit „ja"
beantworten und nichts sagen. Sondern:

> **Was ist dein Stand, was hast du zuletzt gepusht, und was brauchst
> du?**

Also nach dem fragen, **woran es hängt**, nicht danach, ob es
vorangeht.

Und **die Antwort gehört in den Eintrag**, nicht in eine Nachricht an
den Verteiler. Sonst ist die Stille beseitigt und der Zustand trotzdem
nur ihm bekannt.

Nicht sammeln, nicht auf den nächsten Anlass warten: bei jedem Takt
die Übersicht lesen und **jeden** anschreiben, den sie nennt.

Und bleibt eine Nachfrage ihrerseits unbeantwortet, ist das der
Zeitpunkt, an dem es zu der Betreiber gehört — nicht früher.
