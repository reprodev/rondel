// Kalimba — warm plucky thumb piano with slight pitch variation.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = (params.frequency ?? 300) + (Math.random() * 40 - 20);
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  filter.Q.value = 2;
  const gain = ctx.createGain();
  const level = 0.11 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.002 + 0.200);
  gain.gain.setValueAtTime(0, time + 0.202);
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.25);
  osc.onended = () => { osc.disconnect(); filter.disconnect(); gain.disconnect(); };
}
