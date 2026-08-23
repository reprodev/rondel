// Sub Bass — clean deep sine for low-end depth.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 55;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  // Gentle lowpass to remove any aliasing
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 120;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.12 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.080);
  g.gain.setValueAtTime(level * 0.8, time + 0.200);
  g.gain.exponentialRampToValueAtTime(floor(0), time + 0.500);
  g.gain.setValueAtTime(0, time + 0.510);

  osc.connect(lp).connect(g).connect(destination);
  osc.start(time);
  osc.stop(time + 0.520);

  osc.onended = () => { osc.disconnect(); lp.disconnect(); g.disconnect(); };
}
