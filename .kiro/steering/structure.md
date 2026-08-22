# Architecture

**Module map:**

src/
  main.js                     bootstrap, gesture unlock, wire store<->audio<->ui
  audio/  context.js  master.js  noise.js  env.js  delay.js
          voices/{kick,snare,hat,bass,poly,pluck,clap,tom,index}.js
          scheduler.js  clock.worker.js  render.js  wav.js  midi.js   [wav, midi PURE]
  gen/    rng.js  euclid.js  scales.js  melody.js  mutate.js          [all PURE]
  state/  patch.js  codec.js  scenes.js  store.js                     [patch, codec, scenes PURE]
  ui/     oklch.js  geometry.js  canvas.js  radial.js  poster.js
          animations.js  interact.js  controls.js  arrangement.js     [oklch, geometry PURE]

**Two load-bearing invariants:**

1. **Every voice exports exactly one function: `play(ctx, destination, time, params)`.** No module-level `AudioContext`, no globals. This discipline turns WAV export from a three-hour refactor into thirty minutes of plumbing, because the offline renderer just passes a different `ctx`.

2. **Anything pure must stay pure.** `src/gen/`, `codec`, `scenes`, `wav`, `midi`, `oklch`, `geometry` are Node-importable and testable without a browser. No `window`, no `document`, no `Math.random` outside `rng.js`.