// Snare synthesis — noise gives the rattle, triangle gives the body.
// The tone parameter lets the sequencer blend between tight and fat.

import { attack, decay } from '../env.js';
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
  noiseGain.gain.value = 0;
  // Noise level inversely proportional to tone (more noise when tone is low)
  // 0.35 base gain keeps the snare present without overwhelming the mix.
  const noiseLevel = 0.35 * velocity * (1 - tone * 0.6);
  attack(ctx, noiseGain.gain, time, noiseLevel, 0.005);
  decay(ctx, noiseGain.gain, time + 0.005, 0, 0.170);

  noiseSrc.connect(noiseBP).connect(noiseGain).connect(destination);
  noiseSrc.stop(time + 0.2);

  // --- Body component (triangle) ---
  const body = ctx.createOscillator();
  body.type = 'triangle';
  body.frequency.value = 185;

  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0;
  // Body level proportional to tone
  const bodyLevel = 0.35 * velocity * (0.4 + tone * 0.5);
  attack(ctx, bodyGain.gain, time, bodyLevel, 0.005);
  decay(ctx, bodyGain.gain, time + 0.005, 0, 0.110);

  body.connect(bodyGain).connect(destination);
  body.start(time);
  body.stop(time + 0.15);

  // Cleanup
  noiseSrc.onended = () => { noiseSrc.disconnect(); noiseBP.disconnect(); noiseGain.disconnect(); };
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
}
