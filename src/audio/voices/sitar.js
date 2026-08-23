// Sitar — plucked melodic with sympathetic resonance drones.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 220;
  // Primary pluck
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1400;
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  const level = 0.07 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.005 + 0.300);
  gain.gain.setValueAtTime(0, time + 0.305);
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.35);
  // Sympathetic resonance (3 quiet sines)
  const sympathetic = [freq * 0.5, freq * 1.5, freq * 2].map(f => {
    const s = ctx.createOscillator();
    s.type = 'sine';
    s.frequency.value = f;
    const sg = ctx.createGain();
    const sl = 0.025 * velocity;
    sg.gain.setValueAtTime(0, time);
    sg.gain.linearRampToValueAtTime(sl, time + 0.020);
    sg.gain.exponentialRampToValueAtTime(floor(0), time + 0.020 + 0.400);
    sg.gain.setValueAtTime(0, time + 0.420);
    s.connect(sg).connect(destination);
    s.start(time);
    s.stop(time + 0.45);
    return { s, sg };
  });
  osc.onended = () => {
    osc.disconnect(); filter.disconnect(); gain.disconnect();
    sympathetic.forEach(({ s, sg }) => { s.disconnect(); sg.disconnect(); });
  };
}
