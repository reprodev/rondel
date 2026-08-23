# Rondel

**Make music in your browser to share, export or remix. Presets so you don't need to know everything and just start creating.**

Rondel is a generative Euclidean rhythm sequencer that runs entirely in your browser. No install, no account, no copyright worries — just pick a preset, tweak it, and export.

## Why Rondel exists

Getting music for a project shouldn't be hard. Whether you need a background beat for a YouTube video, a loop to rap over, or a MIDI file to drop into your DAW for sampling — the usual path involves expensive software, subscription limits, or hours searching for something that fits.

Rondel was built out of that frustration. The creator wanted a quick way to generate a beat as a MIDI and WAV file while working on sampling vocal tracks from an advert he remembered. Instead of spending hours in a full DAW just to get a rhythm bed, Rondel lets you have something usable in seconds — so you can focus on the creative work that actually matters.

It's also designed for people who aren't musicians. You don't need to understand time signatures or synthesis. Pick a preset, change the key if you want, export, done. You made that. It's yours.

## Who is this for

- **Content creators** who need background music without copyright strikes
- **Rappers and producers** looking for quick beat ideas or loop material
- **Non-musicians** who want to make something without music theory
- **Students** exploring generative music and Euclidean rhythms
- **Anyone** who wants a beat or background music fast without opening a DAW

## What makes it different

- **Zero friction** — no install, no signup, no download. Open in a browser and go.
- **Platform agnostic** — works on phone, tablet, laptop. No need to remote into a powerful machine.
- **Lightweight** — no RAM-heavy DAW. Just a web page with Web Audio synthesis.
- **You own it** — everything you make is yours. No subscription limits on exports.
- **WAV + MIDI** — export both instantly. Drop the MIDI into Ableton, GarageBand, FL Studio, or whatever you use.
- **75 presets across 5 genres** — Dancefloor, World & Groove, Ambient & Study, Epic & Cinematic, Vocal & Chorus.
- **30 instruments** — drums, bass, melodic, pads, vocal textures. Assign any to any ring.
- **Key and scale** — change the musical key with one click. No theory needed.
- **Share links** — copy a URL that recreates your exact patch. Send it to anyone.

## Features

| Feature | Details |
|---------|---------|
| Voices | 30 synthesized instruments (Web Audio, no samples) |
| Presets | 75 curated across 5 categories |
| Export | WAV (any duration) + MIDI (4 bars) |
| Key/Scale | 15 keys × 9 scales |
| BPM | 40–200, adjustable live |
| Rings | 5 concurrent Euclidean rhythm layers |
| Sharing | URL-encoded patch state |
| Mobile | Responsive — phone, tablet, desktop |
| Dependencies | Zero. Pure ESM, no build step. |

## Getting started

### Option 1: Just open it

Open `index.html` in any modern browser. That's it.

> Serving over HTTP gives the best timing accuracy (Web Worker clock). Opening the file directly still works — the app falls back to a standard timer automatically.

### Option 2: Node.js

```bash
git clone https://github.com/yourusername/Rondel.git
cd Rondel
npm start
# → http://localhost:3000
```

Or without npm:
```bash
node serve.js
```

### Option 3: Docker

```bash
docker build -t rondel .
docker run -p 3000:3000 rondel
# → http://localhost:3000
```

### Option 4: Any static file server

```bash
# Python
python3 -m http.server 3000

# npx (no install needed)
npx serve .
```

## Deploying to the web

### GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Your app is live at `https://yourusername.github.io/Rondel`

All paths are relative so it works on any subpath. The Dockerfile, package.json, and test files don't affect the site — browsers only load what index.html references.

### Netlify / Vercel / Cloudflare Pages

Connect the repo. No build command needed. Publish directory: `.` (root). Deploys on every push.

## How to use

1. **Pick a preset** — browse by category or search by name
2. **Hit play** — press Space or click the play button
3. **Make it yours** — change key, scale, BPM, swap instruments
4. **Edit patterns** — click rings on the canvas to add/remove beats
5. **Export** — WAV for audio, MIDI for your DAW, or copy a share link

## Running tests

```bash
npm test
```

263 tests across 14 test files covering all pure modules.

## Tech stack

- Pure JavaScript (ES modules)
- Web Audio API for synthesis
- Canvas 2D for the radial visualisation
- No framework, no bundler, no dependencies
- Node.js only needed for local dev server and tests

## Project structure

```
index.html       — the app (HTML + CSS + inline script)
serve.js         — zero-dependency dev server
package.json     — npm start/test scripts
Dockerfile       — containerised deployment
src/
  audio/         — 30 voice synths, scheduler, master chain, WAV/MIDI export
  ui/            — canvas renderer, interaction handlers, controls
  gen/           — Euclidean algorithm, scales, melody generation
  state/         — patch schema, validation, 75 presets, URL codec
test/            — unit tests for all pure modules
```

## License

MIT. All audio you export is yours — no attribution required for the music you create.

---

Built with Web Audio, Euclidean rhythms, and the belief that making music should be as easy as pressing play.
