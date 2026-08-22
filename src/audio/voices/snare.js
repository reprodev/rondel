// Snare synthesis — noise gives the rattle, triangle gives the body.
// The tone parameter lets the sequencer blend between tight and fat.

import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, tone?: 0-1, velocity? }
 */
export function play(ctx, destination, time, params) {
  const tone = params.tone ?? 0.5;
  const velocity = params.velocity ?? 0.8;

  // Ensure noise buffer exists
  initNoise(ctx);

  // --- Noise component (rattle) ---
  const noiseSrc = createNoiseSource(ctx, time);
  const noiseBP = ctx.createBiquadFilter();
  noiseBP.type = 'bandpass';
  noiseBP.frequency.value = 1900;
  noiseBP.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  // Single unbroken envelope chain to avoid cancel conflict.
  // 0.45 base gain — snare needs to crack through the mix as the
  // second-loudest element. The bandpass attenuates significantly.
  const noiseLevel = 0.45 * velocity * (1 - tone * 0.6);
  noiseGain.gain.setValueAtTime(0, time);
  noiseGain.gain.linearRampToValueAtTime(noiseLevel, time + 0.005);         // 5ms attack
  noiseGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.005 + 0.170); // 170ms decay
  noiseGain.gain.setValueAtTime(0, time + 0.005 + 0.170);                  // snap to zero

  noiseSrc.connect(noiseBP).connect(noiseGain).connect(destination);
  noiseSrc.stop(time + 0.2);

  // --- Body component (triangle) ---
  const body = ctx.createOscillator();
  body.type = 'triangle';
  body.frequency.value = 185;

  const bodyGain = ctx.createGain();
  const bodyLevel = 0.45 * velocity * (0.4 + tone * 0.5);
  bodyGain.gain.setValueAtTime(0, time);
  bodyGain.gain.linearRampToValueAtTime(bodyLevel, time + 0.005);           // 5ms attack
  bodyGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.005 + 0.110); // 110ms decay
  bodyGain.gain.setValueAtTime(0, time + 0.005 + 0.110);                   // snap to zero

  body.connect(bodyGain).connect(destination);
  body.start(time);
  body.stop(time + 0.15);

  // Cleanup
  noiseSrc.onended = () => { noiseSrc.disconnect(); noiseBP.disconnect(); noiseGain.disconnect(); };
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
}
