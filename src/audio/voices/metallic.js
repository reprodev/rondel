// Metallic — FM synthesis inharmonic bell tone for experimental textures.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 340;

  // FM: carrier + modulator for inharmonic partials
  const mod = ctx.createOscillator();
  mod.type = 'sine';
  mod.frequency.value = freq * 1.414; // irrational ratio = inharmonic

  const modGain = ctx.createGain();
  modGain.gain.value = freq * 0.8;

  const carrier = ctx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.value = freq;

  mod.connect(modGain).connect(carrier.frequency);

  // Damping filter
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1800;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.06 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.003);
  g.gain.exponentialRampToValueAtTime(floor(0), time + 0.400);
  g.gain.setValueAtTime(0, time + 0.410);

  carrier.connect(lp).connect(g).connect(destination);
  carrier.start(time);
  mod.start(time);
  carrier.stop(time + 0.420);
  mod.stop(time + 0.420);

  carrier.onended = () => { carrier.disconnect(); mod.disconnect(); modGain.disconnect(); lp.disconnect(); g.disconnect(); };
}
