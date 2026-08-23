// Gong — dramatic sustained resonance with noise + sine fundamental.
import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  initNoise(ctx);
  // Noise component
  const noiseSrc = createNoiseSource(ctx, time);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(500, time);
  noiseFilter.frequency.linearRampToValueAtTime(900, time + 0.8);
  const noiseGain = ctx.createGain();
  const noiseLevel = 0.03 * velocity;
  noiseGain.gain.setValueAtTime(0, time);
  noiseGain.gain.linearRampToValueAtTime(noiseLevel, time + 0.030);
  noiseGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.030 + 1.800);
  noiseGain.gain.setValueAtTime(0, time + 1.830);
  noiseSrc.connect(noiseFilter).connect(noiseGain).connect(destination);
  noiseSrc.stop(time + 1.9);
  // Sine fundamental
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 200;
  const oscGain = ctx.createGain();
  const oscLevel = 0.07 * velocity;
  oscGain.gain.setValueAtTime(0, time);
  oscGain.gain.linearRampToValueAtTime(oscLevel, time + 0.030);
  oscGain.gain.exponentialRampToValueAtTime(floor(0), time + 0.030 + 1.800);
  oscGain.gain.setValueAtTime(0, time + 1.830);
  osc.connect(oscGain).connect(destination);
  osc.start(time);
  osc.stop(time + 1.9);
  noiseSrc.onended = () => { noiseSrc.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); };
  osc.onended = () => { osc.disconnect(); oscGain.disconnect(); };
}
