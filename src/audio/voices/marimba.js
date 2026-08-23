// Marimba — warm wooden mallet with resonant body.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 260;

  // Sine for warmth (no sawtooth harmonics)
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  // Second partial (octave) for wood character
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 4; // 4th harmonic = wooden resonance

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1200;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.09 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.003);
  g.gain.exponentialRampToValueAtTime(floor(0), time + 0.250);
  g.gain.setValueAtTime(0, time + 0.260);

  const g2 = ctx.createGain();
  g2.gain.value = 0.25; // 4th harmonic much quieter

  osc.connect(lp);
  osc2.connect(g2).connect(lp);
  lp.connect(g).connect(destination);

  osc.start(time);
  osc2.start(time);
  osc.stop(time + 0.270);
  osc2.stop(time + 0.270);

  osc.onended = () => { osc.disconnect(); osc2.disconnect(); g2.disconnect(); lp.disconnect(); g.disconnect(); };
}
