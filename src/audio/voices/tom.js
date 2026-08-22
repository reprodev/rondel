// Tom — pitch-swept triangle for melodic percussion fills.
// The falling pitch gives the characteristic "boing" of a real tom,
// while the tight envelope keeps it from ringing too long.

import { floor } from '../env.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, velocity?, frequency? }
 */
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const baseFreq = params.frequency ?? 150;

  const osc = ctx.createOscillator();
  osc.type = 'triangle';

  // Pitch sweep: start 20% higher, fall to base over 70ms
  const startFreq = baseFreq * 1.2;
  osc.frequency.setValueAtTime(startFreq, time);
  osc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.070);

  // Amplitude envelope — tight and punchy
  const gain = ctx.createGain();
  const level = 0.2 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.003);               // 3ms attack
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.003 + 0.140); // 140ms decay
  gain.gain.setValueAtTime(0, time + 0.003 + 0.140);                   // snap to zero

  // Routing
  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.18);

  // Cleanup
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
