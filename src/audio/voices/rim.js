// Rim — dry high-frequency click (sidestick).
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.value = 180;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2500;
  const gain = ctx.createGain();
  const level = 0.08 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.001);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.001 + 0.004);
  gain.gain.setValueAtTime(0, time + 0.005);
  osc.connect(hp).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.01);
  osc.onended = () => { osc.disconnect(); hp.disconnect(); gain.disconnect(); };
}
