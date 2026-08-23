// Shaker — filtered noise burst for rhythmic texture (maraca/shaker).
import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  initNoise(ctx);

  const noise = createNoiseSource(ctx, time);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 6000;
  hp.Q.value = 0.5;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 10000;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.06 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.002);
  g.gain.exponentialRampToValueAtTime(floor(0), time + 0.035);
  g.gain.setValueAtTime(0, time + 0.040);

  noise.connect(hp).connect(lp).connect(g).connect(destination);
  noise.stop(time + 0.050);

  noise.onended = () => { noise.disconnect(); hp.disconnect(); lp.disconnect(); g.disconnect(); };
}
