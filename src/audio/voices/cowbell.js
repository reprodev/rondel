// Cowbell — bright metallic ping for samba/funk patterns.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 540;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 540;
  filter.Q.value = 3;
  const gain = ctx.createGain();
  const level = 0.12 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.002 + 0.080);
  gain.gain.setValueAtTime(0, time + 0.082);
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.1);
  osc.onended = () => { osc.disconnect(); filter.disconnect(); gain.disconnect(); };
}
