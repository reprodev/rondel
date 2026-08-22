// Clap — three rapid noise bursts plus a body burst creates the layered
// "finger tap" sound of a real hand clap. The spacing between bursts is
// what distinguishes a clap from a snare.

import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, velocity? }
 */
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const level = 0.25 * velocity;

  initNoise(ctx);

  // --- Three "finger" bursts: quick highpassed noise taps ---
  for (let i = 0; i < 3; i++) {
    const t = time + i * 0.009; // 9ms apart
    const src = createNoiseSource(ctx, t);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2000;

    const fingerGain = ctx.createGain();
    const fingerLevel = level * 0.8;
    fingerGain.gain.setValueAtTime(0, t);
    fingerGain.gain.linearRampToValueAtTime(fingerLevel, t + 0.002);           // 2ms attack
    fingerGain.gain.exponentialRampToValueAtTime(floor(0), t + 0.002 + 0.006); // 6ms decay
    fingerGain.gain.setValueAtTime(0, t + 0.008);                             // snap

    src.connect(hp).connect(fingerGain).connect(destination);
    src.stop(t + 0.012);

    src.onended = () => { src.disconnect(); hp.disconnect(); fingerGain.disconnect(); };
  }

  // --- Body burst: filtered noise + low sine for resonance ---
  const bodySrc = createNoiseSource(ctx, time);
  const bodyLP = ctx.createBiquadFilter();
  bodyLP.type = 'lowpass';
  bodyLP.frequency.value = 8000;

  const bodyGain = ctx.createGain();
  const bodyLevel = level;
  bodyGain.gain.setValueAtTime(0, time);
  bodyGain.gain.linearRampToValueAtTime(bodyLevel, time + 0.004);             // 4ms attack
  bodyGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.004 + 0.046); // 46ms decay
  bodyGain.gain.setValueAtTime(0, time + 0.050);                             // snap

  bodySrc.connect(bodyLP).connect(bodyGain).connect(destination);
  bodySrc.stop(time + 0.06);

  // Low sine for body resonance
  const sine = ctx.createOscillator();
  sine.type = 'sine';
  sine.frequency.value = 80;

  const sineGain = ctx.createGain();
  const sineLevel = level * 0.4;
  sineGain.gain.setValueAtTime(0, time);
  sineGain.gain.linearRampToValueAtTime(sineLevel, time + 0.004);
  sineGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.004 + 0.046);
  sineGain.gain.setValueAtTime(0, time + 0.050);

  sine.connect(sineGain).connect(destination);
  sine.start(time);
  sine.stop(time + 0.06);

  // Cleanup
  bodySrc.onended = () => { bodySrc.disconnect(); bodyLP.disconnect(); bodyGain.disconnect(); };
  sine.onended = () => { sine.disconnect(); sineGain.disconnect(); };
}
