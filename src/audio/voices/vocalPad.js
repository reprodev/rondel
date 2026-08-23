// Vocal Pad — sustained "aah/ooh" texture with slow attack and warm sustain.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.6;
  const releaseEnd = time + duration + 1.2;

  // Formant-like oscillators (warm vowel "aah")
  const formants = [320, 800, 2500];
  const gains = [0.05, 0.035, 0.015];

  formants.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const g = ctx.createGain();
    const level = gains[i] * velocity;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.250); // slow attack
    g.gain.setValueAtTime(level * 0.8, time + duration);
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);

    osc.connect(g).connect(destination);
    osc.start(time);
    osc.stop(releaseEnd + 0.01);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); g.disconnect(); };
    }
  });

  // Subtle detuned layer for warmth
  const detune = ctx.createOscillator();
  detune.type = 'triangle';
  detune.frequency.value = 315;
  const dg = ctx.createGain();
  const dl = 0.02 * velocity;
  dg.gain.setValueAtTime(0, time);
  dg.gain.linearRampToValueAtTime(dl, time + 0.300);
  dg.gain.setValueAtTime(dl * 0.7, time + duration);
  dg.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  dg.gain.setValueAtTime(0, releaseEnd);
  detune.connect(dg).connect(destination);
  detune.start(time);
  detune.stop(releaseEnd + 0.01);
}
