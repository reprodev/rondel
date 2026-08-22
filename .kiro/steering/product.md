# Product Brief

**Rondel** is a generative music toy in the browser. Concentric rings — one per voice — sit on a circular sequencer. Euclidean rhythms distribute hits evenly around each ring, rings run at different step counts so they drift polymetrically against each other, and per-step probability plus a deterministic `mutate` mean the instrument composes *alongside* you rather than replaying you.

## Design Goals (in priority order)

1. **It must sound genuinely beautiful.** Five-voice polymetric generative Euclidean sequencer running at 120 BPM, with mix balance, gain staging, and reverb that convince a listener it's a real instrument, not a beep box.

2. **It must look like something.** Radial rings, playhead that sweeps with audio clock precision, hit animations that flash exactly on the transient, colours that never clash, and a palette that changes with every patch.

3. **It must be playable and exploratory.** Click steps on/off, drag probability, adjust pulses/rotation/tempo per ring, mutate into variations, chain scenes into arrangements — the experience should feel like you're *conducting* something that's playing with you.

4. **It must be shareable and reproducible.** A link encodes a patch exactly; pasting it in a fresh window reproduces the same piece bit-for-bit. No backend, no accounts, no login.

## Tone

Playful, inviting, elegant. The demo should make someone want to press play and spend ten minutes noodling. The README should feel honest about how it was built, not like theatre.