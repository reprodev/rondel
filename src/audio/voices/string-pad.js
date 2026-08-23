// String pad — orchestral sustained resonance with filter swell.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 220;
  const duration = params.duration ?? 0.5;
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, time);
  filter.frequency.linearRampToValueAtTime(900, time + 0.200);
  filter.frequency.exponentialRampToValueAtTime(floor(600), time + duration);
  const gain = ctx.createGain();
  const peakGain = 0.08 * velocity;
  const sustainLevel = peakGain * 0.5;
  const attackEnd = time + 0.200;
  const releaseStart = time + duration;
  const releaseEnd = releaseStart + 1.000;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peakGain, attackEnd);
  gain.gain.linearRampToValueAtTime(sustainLevel, attackEnd + 0.100);
  gain.gain.setValueAtTime(sustainLevel, releaseStart);
  gain.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  gain.gain.setValueAtTime(0, releaseEnd);
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(releaseEnd + 0.01);
  osc.onended = () => { osc.disconnect(); filter.disconnect(); gain.disconnect(); };
}
