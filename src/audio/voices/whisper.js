// Whisper — ethereal breathy vocal (subtle, intimate, atmospheric).
import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.6;
  initNoise(ctx);
  const releaseEnd = time + duration + 1.500;

  // Filtered noise as breath texture
  const noise = createNoiseSource(ctx, time);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2500;
  bp.Q.value = 2;

  const g = ctx.createGain();
  const level = 0.05 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.200); // soft attack
  g.gain.setValueAtTime(level * 0.6, time + duration);
  g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  g.gain.setValueAtTime(0, releaseEnd);

  noise.connect(bp).connect(g).connect(destination);
  noise.stop(releaseEnd + 0.01);

  // Subtle tonal hint (very quiet sine)
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 600;
  const og = ctx.createGain();
  const ol = 0.015 * velocity;
  og.gain.setValueAtTime(0, time);
  og.gain.linearRampToValueAtTime(ol, time + 0.300);
  og.gain.setValueAtTime(ol * 0.5, time + duration);
  og.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  og.gain.setValueAtTime(0, releaseEnd);
  osc.connect(og).connect(destination);
  osc.start(time);
  osc.stop(releaseEnd + 0.01);

  noise.onended = () => { noise.disconnect(); bp.disconnect(); g.disconnect(); };
  osc.onended = () => { osc.disconnect(); og.disconnect(); };
}
