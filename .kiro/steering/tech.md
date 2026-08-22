# Technical Constraints

**Vanilla JavaScript, ES modules, zero dependencies, zero build step.**

- No npm packages (except devDeps for testing).
- No TypeScript, no frameworks, no Tone.js.
- No web fonts (system-ui stack only).
- No audio sample files — every voice synthesised at runtime.
- No CSS framework or CSS-in-JS.
- Targets: desktop Chrome and Firefox (May 2026+). No mobile, no Safari, no IE.

**Offline-first.**

- Fully functional without network.
- No external assets, no CDN, no Google Fonts, no API calls.
- WAV export uses `OfflineAudioContext`; everything reproducible and deterministic.

**Load-bearing invariant:** Every piece of code under `src/gen/`, `src/state/codec.js`, `src/state/scenes.js`, `src/audio/wav.js`, `src/audio/midi.js`, `src/ui/oklch.js`, `src/ui/geometry.js` must be **pure and Node-importable** — no `window`, no `document`, no `AudioContext` references, zero `Math.random` outside `rng.js`. This is the shape that makes agentic code generation productive.