// Bell — warm harmonic chime with damped high frequencies.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  // Lower, warmer partials (shifted down from 800/1200/2400)
  const freqs = [520, 780, 1400];
  // Gentle lowpass to tame brightness
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1600;
  filter.Q.value = 0.5;
  const gain = ctx.createGain();
  const level = 0.08 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 1.000);
  gain.gain.setValueAtTime(0, time + 1.010);
  const oscs = freqs.map((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    // Higher partials quieter
    g.gain.value = i === 0 ? 0.4 : i === 1 ? 0.3 : 0.15;
    o.connect(g).connect(filter);
    o.start(time);
    o.stop(time + 1.050);
    return { o, g };
  });
  filter.connect(gain).connect(destination);
  oscs[0].o.onended = () => {
    oscs.forEach(({ o, g }) => { o.disconnect(); g.disconnect(); });
    filter.disconnect(); gain.disconnect();
  };
}
