// Conga — warm pitched drum with sine sweep for Latin percussion.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.060);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  const gain = ctx.createGain();
  const level = 0.15 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.003 + 0.180);
  gain.gain.setValueAtTime(0, time + 0.183);
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.22);
  osc.onended = () => { osc.disconnect(); filter.disconnect(); gain.disconnect(); };
}
