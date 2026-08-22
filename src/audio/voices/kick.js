// 808 kick — sine oscillator with pitch sweep gives the characteristic
// sub-bass punch without needing a sample library.

import { attack, decay } from '../env.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time - absolute audio time to fire
 * @param {object} params - { step, voice, velocity? }
 */
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 1.0;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';

  // Pitch sweep: 150 Hz → 45 Hz over 70ms
  // The fast downward sweep is what gives the kick its "thump" character.
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.07);

  // Amplitude envelope
  gain.gain.value = 0;
  attack(ctx, gain.gain, time, velocity, 0.004);       // 4ms attack
  decay(ctx, gain.gain, time + 0.004, 0, 0.340);       // 340ms decay

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.4);

  // Cleanup on note end
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
