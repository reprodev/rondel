# 🎵 Rondel

<div align="center">

**A generative Euclidean rhythm sequencer that runs entirely in your browser.**

Make music to share, export or remix. Presets so you don't need to know everything — just start creating.

[**Try it live →**](https://rondel.reprodev.com)

</div>

---

Instead of expensive DAWs, subscription limits, or hours searching for the right loop — Rondel gives you a usable beat in seconds. Pick a preset, tweak it, export as WAV or MIDI. It's yours. No account, no install, no copyright worries.

The sequencer uses Euclidean rhythms — a mathematical way of spacing beats as evenly as possible. The same patterns found in West African djembe, Cuban tresillo, and countless other musical traditions. You don't need to know any of this — the presets handle it — but it's why everything sounds musical instead of random.

## Demo

> **[rondel.reprodev.com](https://rondel.reprodev.com)** — Open on any device. Works on phone, tablet, and desktop.

Pick a preset from the sidebar, hit play, change the key — export when you're happy. Everything synthesised in real-time with Web Audio.

## Features

| Feature | Details |
|---------|---------|
| 🎹 Voices | 30 synthesised instruments (Web Audio, zero samples) |
| 🎛️ Presets | 75 curated across 5 categories |
| 📤 Export | WAV (any duration) + MIDI (4 bars) |
| 🎵 Key/Scale | 15 keys × 9 scales |
| ⏱️ BPM | 40–200, adjustable live |
| 🔵 Rings | 5 concurrent Euclidean rhythm layers |
| 🔗 Sharing | URL-encoded patch state — share with one link |
| 📱 Mobile | Fully responsive with bottom sheet UI |
| 📦 Dependencies | Zero. Pure ESM, no build step |

## Who Is This For

- **Content creators** — background music without copyright strikes
- **Rappers and producers** — quick beat ideas, loop material, MIDI to drop into your DAW
- **Non-musicians** — make something without music theory
- **Students** — explore generative music and Euclidean rhythms
- **Anyone** — who wants a beat fast without opening a DAW

## What Makes It Different

- **Zero friction** — no install, no signup, no download
- **Platform agnostic** — phone, tablet, laptop. No powerful machine needed
- **Lightweight** — no RAM-heavy DAW, just a web page
- **You own it** — everything you export is yours, no subscription limits
- **WAV + MIDI** — drop the MIDI into Ableton, GarageBand, FL Studio, whatever you use
- **30 instruments** — drums, bass, melodic, pads, vocal textures. Assign any to any ring
- **Share links** — URL recreates your exact patch. Send it to anyone

## Getting Started

### Option 1: Just open it

Open `index.html` in any modern browser. That's it.

> Serving over HTTP gives the best timing accuracy (Web Worker clock). Opening the file directly still works — the app falls back to a standard timer automatically.

### Option 2: Node.js

```bash
git clone https://github.com/reprodev/rondel.git
cd rondel
npm start
# → http://localhost:3000
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

# npx
npx serve .
```

## Deploying

### GitHub Pages

1. Push this repo to GitHub
2. **Settings → Pages → Deploy from branch** → `main` → `/ (root)`
3. Live at `https://yourusername.github.io/rondel`

All paths are relative — works on any subpath. The Dockerfile, package.json, and test files don't affect the site.

### Netlify / Vercel / Cloudflare Pages

Connect the repo. No build command. Publish directory: `.` (root). Deploys on push.

## How To Use

1. **Pick a preset** — browse by category or search by name
2. **Hit play** — press Space or click the play button
3. **Make it yours** — change key, scale, BPM, swap instruments
4. **Edit patterns** — click rings on the canvas to add/remove beats
5. **Export** — WAV for audio, MIDI for your DAW, or copy a share link

## Project Structure

```
rondel/
├── index.html          ← The app (HTML + CSS + inline script)
├── serve.js            ← Zero-dependency dev server
├── package.json        ← npm start/test scripts
├── Dockerfile          ← Containerised deployment
├── src/
│   ├── audio/          ← 30 voice synths, scheduler, master chain, export
│   ├── ui/             ← Canvas renderer, interactions, controls
│   ├── gen/            ← Euclidean algorithm, scales, melody generation
│   └── state/          ← Patch schema, 75 presets, URL codec
├── test/               ← 263 unit tests across 14 files
└── README.md
```

## Tech Stack

- Pure JavaScript (ES modules)
- Web Audio API for synthesis
- Canvas 2D for radial visualisation
- No framework, no bundler, no dependencies
- Node.js only needed for local dev server and tests

## Tests

```bash
npm test
```

263 tests across 14 test files covering all pure modules.

## Why Rondel Exists

Getting music for a project shouldn't be hard. Whether you need a background beat for a video, a loop to rap over, or a MIDI file to drop into your DAW — the usual path involves expensive software, subscription limits, or hours searching.

Rondel was built out of that frustration. The creator wanted a quick way to generate a beat as a MIDI and WAV file while working on sampling vocal tracks. Instead of spending hours in a full DAW just to get a rhythm bed, Rondel gives you something usable in seconds — so you can focus on the creative work that actually matters.

## License

MIT — this project is open-source. Fork it, remix it, build on it, make it your own.

All audio you export is yours — no attribution required for the music you create.

## Built With Kiro

This project was built using [Kiro IDE](https://kiro.dev):

- **Steering** — Project context loaded into every session
- **Spec-driven development** — Requirements → Design → Tasks workflow
- **Collaborative authoring** — All code written in partnership with Kiro
- **Iterative development** — Visible in commit history from first synth to final polish

---

<div align="center">

🎵 **The rhythm is yours.**

Built using [Kiro](https://kiro.dev) for the [Ready, Spec, Ship 2026 Hackathon](https://codingagents.fyi/hackathon/kiro/) by [codingagents.fyi](https://codingagents.fyi) — Sponsored by [Kiro](https://kiro.dev)

</div>