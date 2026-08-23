// Organ — sustained drawbar-style tone (fundamental + octave + 5th).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 220;
  const duration = params.duration ?? 0.4;
  const releaseEnd = time + duration + 0.300;

  // Drawbar mix: fundamental, octave, twelfth (like a Hammond)
  const partials = [
    { ratio: 1, amp: 0.5 },
    { ratio: 2, amp: 0.35 },
    { ratio: 3, amp: 0.15 },
  ];

  // Gentle lowpass
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1400;
  lp.Q.value = 0.5;

  const g = ctx.createGain();
  const level = 0.07 * velocity;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(level, time + 0.010);
  g.gain.setValueAtTime(level * 0.9, time + duration);
  g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  g.gain.setValueAtTime(0, releaseEnd);

  lp.connect(g).connect(destination);

  const oscs = partials.map(({ ratio, amp }) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq * ratio;
    const og = ctx.createGain();
    og.gain.value = amp;
    o.connect(og).connect(lp);
    o.start(time);
    o.stop(releaseEnd + 0.01);
    return { o, og };
  });

  oscs[0].o.onended = () => {
    oscs.forEach(({ o, og }) => { o.disconnect(); og.disconnect(); });
    lp.disconnect(); g.disconnect();
  };
}
