// Bell — harmonic chime with three sine partials for ethereal presence.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freqs = [800, 1200, 2400];
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2200;
  const gain = ctx.createGain();
  const level = 0.10 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.040);
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.040 + 1.200);
  gain.gain.setValueAtTime(0, time + 1.240);
  const oscs = freqs.map(f => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.33;
    o.connect(g).connect(filter);
    o.start(time);
    o.stop(time + 1.3);
    return { o, g };
  });
  filter.connect(gain).connect(destination);
  oscs[0].o.onended = () => {
    oscs.forEach(({ o, g }) => { o.disconnect(); g.disconnect(); });
    filter.disconnect(); gain.disconnect();
  };
}
