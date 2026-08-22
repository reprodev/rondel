// Vibraphone — warm sine with amplitude tremolo for jazzy harmonic decay.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 400;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  // Tremolo via LFO modulating gain
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 6;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.3 * velocity;
  lfo.connect(lfoGain);
  const gain = ctx.createGain();
  const level = 0.12 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.020);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.020 + 0.600);
  gain.gain.setValueAtTime(0, time + 0.620);
  lfoGain.connect(gain.gain);
  osc.connect(gain).connect(destination);
  osc.start(time);
  lfo.start(time);
  osc.stop(time + 0.65);
  lfo.stop(time + 0.65);
  osc.onended = () => { osc.disconnect(); lfo.disconnect(); lfoGain.disconnect(); gain.disconnect(); };
}
