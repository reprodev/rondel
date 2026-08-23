# Rondel

**Make music in your browser to share, export or remix. Presets so you don't need to know everything and just start creating.**

Rondel is a generative Euclidean rhythm sequencer that runs entirely in your browser. No install, no account, no copyright worries — just pick a preset, tweak it, and export.

## Why Rondel exists

Getting music for a project shouldn't be hard. Whether you need a background beat for a YouTube video, a loop to rap over, or a MIDI file to drop into your DAW for sampling — the usual path involves expensive software, subscription limits, or hours searching for something that fits.

Rondel was built out of that frustration. The creator wanted a quick way to generate a beat as a MIDI and WAV file while working on sampling vocal tracks for an advert. Instead of spending hours in a full DAW just to get a rhythm bed, Rondel lets you have something usable in seconds — so you can focus on the creative work that actually matters.

It's also designed for people who aren't musicians. You don't need to understand time signatures or synthesis. Pick a preset, change the key if you want, export, done. You made that. It's yours.

## Who is this for

- **Content creators** who need background music without copyright strikes
- **Rappers and producers** looking for quick beat ideas or loop material
- **Non-musicians** who want to make something without music theory
- **Students** exploring generative music and Euclidean rhythms
- **Anyone** who wants a beat fast without opening a DAW

## What makes it different

- **Zero friction** — no install, no signup, no download. Open in a browser and go.
- **Platform agnostic** — works on phone, tablet, laptop. No need to remote into a powerful machine.
- **Lightweight** — no RAM-heavy DAW. Just a web page with Web Audio synthesis.
- **You own it** — everything you make is yours. No subscription limits on exports.
- **WAV + MIDI** — export both instantly. Drop the MIDI into Ableton, GarageBand, FL Studio, or whatever you use.
- **75 presets across 5 genres** — Dancefloor, World & Groove, Ambient & Study, Epic & Cinematic, Vocal & Chorus. Start from something good and make it yours.
- **30 instruments** — drums, bass, melodic, pads, vocal textures. Assign any to any ring.
- **Key and scale** — change the musical key with one click. No theory needed.
- **Share links** — copy a URL that recreates your exact patch. Send it to anyone.

## Features

| Feature | Details |
|---------|---------|
| Voices | 30 synthesized instruments (Web Audio, no samples) |
| Presets | 75 curated across 5 categories |
| Export | WAV (any duration) + MIDI (4 bars) |
| Key/Scale | 15 keys × 9 scales = 135 tonal options |
| BPM | 40–200, adjustable live |
| Rings | 5 concurrent Euclidean rhythm layers |
| Sharing | URL-encoded patch state (hash link) |
| Mobile | Responsive — works on phone/tablet |
| Dependencies | Zero. Pure ESM, no build step. |

## Getting started

```bash
# Clone and serve
git clone <repo-url>
cd Rondel
node serve.js
# Open http://localhost:3000
```

Or just open `index.html` in any modern browser.

## How to use

1. **Pick a preset** — Open the sidebar, browse by category or search
2. **Hit play** — Press Space or click the play button
3. **Make it yours** — Change the key, swap instruments, adjust BPM
4. **Click the canvas** — Add/remove beats on the radial display
5. **Export** — WAV for audio, MIDI for your DAW, or copy a share link

## Tech stack

- Pure JavaScript (ES modules)
- Web Audio API for all synthesis
- Canvas 2D for radial visualization
- No framework, no bundler, no dependencies
- `node --test` for unit tests (263 passing)

## Running tests

```bash
node --test test/*.test.js
```

## Project structure

```
src/
  audio/       — voices, scheduler, master chain, export, MIDI
  ui/          — canvas renderer, interaction, controls
  gen/         — Euclidean algorithm, scales, melody, RNG
  state/       — patch creation, validation, presets, codec
test/          — unit tests for all pure modules
index.html     — single-file app (HTML + CSS + inline script)
serve.js       — minimal dev server
```

## License

All exports are yours to use however you want. The source code license is TBD.

---

Built with Web Audio, Euclidean rhythms, and the belief that making music should be as easy as pressing play.
