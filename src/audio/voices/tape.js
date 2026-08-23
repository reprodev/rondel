// Tape — lo-fi warped texture with wow/flutter modulation.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 180;
  const duration = params.duration ?? 0.5;
  const releaseEnd = time + duration + 0.800;

  // Base tone
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;

  // Wow/flutter LFO modulating pitch
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 3.5; // slow wobble
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 4; // ±4Hz pitch wobble
  lfo.connect(lfoGain).connect(osc.frequency);

  // Heavy lowpass for tape warmth
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 800;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.08 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.150);
  g.gain.setValueAtTime(level * 0.7, time + duration);
  g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  g.gain.setValueAtTime(0, releaseEnd);

  osc.connect(lp).connect(g).connect(destination);
  osc.start(time);
  lfo.start(time);
  osc.stop(releaseEnd + 0.01);
  lfo.stop(releaseEnd + 0.01);

  osc.onended = () => { osc.disconnect(); lfo.disconnect(); lfoGain.disconnect(); lp.disconnect(); g.disconnect(); };
}
