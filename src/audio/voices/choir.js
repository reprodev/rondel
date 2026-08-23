// Choir — warm breathy vocal texture using filtered noise formants.
// Uses bandpass-filtered noise to simulate vowel shapes rather than
// raw sine oscillators, which prevents the harmonic stacking/whine
// that occurs when notes overlap at fast tempos.
import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.5;
  initNoise(ctx);
  const releaseEnd = time + duration + 1.200;

  // Master output with lowpass to keep everything warm
  const masterLP = ctx.createBiquadFilter();
  masterLP.type = 'lowpass';
  masterLP.frequency.value = 2000;
  masterLP.Q.value = 0.4;
  masterLP.connect(destination);

  // Formant bands — bandpass-filtered noise simulates vowel resonances
  // without the pure-tone stacking that causes whine
  const formants = [
    { freq: 320, Q: 4, gain: 0.06 },   // chest/fundamental
    { freq: 700, Q: 3, gain: 0.04 },   // mid vowel body
    { freq: 1800, Q: 2, gain: 0.015 }, // presence (kept low to avoid brightness)
  ];

  formants.forEach(({ freq, Q, gain: fGain }) => {
    const noise = createNoiseSource(ctx, time);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = Q;

    const g = ctx.createGain();
    const level = fGain * velocity;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.200);
    g.gain.setValueAtTime(level * 0.7, time + duration);
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);

    noise.connect(bp).connect(g).connect(masterLP);
    noise.stop(releaseEnd + 0.01);

    noise.onended = () => { noise.disconnect(); bp.disconnect(); g.disconnect(); };
  });

  // Soft sub tone for warmth (low enough to never whine)
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 160;
  const subGain = ctx.createGain();
  const subLevel = 0.025 * velocity;
  subGain.gain.setValueAtTime(0, time);
  subGain.gain.linearRampToValueAtTime(subLevel, time + 0.250);
  subGain.gain.setValueAtTime(subLevel * 0.6, time + duration);
  subGain.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  subGain.gain.setValueAtTime(0, releaseEnd);
  sub.connect(subGain).connect(masterLP);
  sub.start(time);
  sub.stop(releaseEnd + 0.01);
  sub.onended = () => { sub.disconnect(); subGain.disconnect(); masterLP.disconnect(); };
}