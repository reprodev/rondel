// Hi-hat — filtered noise shaped by decay time. Closed hats are tight;
// open hats ring until choked by the next closed hit.

import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';

// Module-scoped choke state — tracks the currently ringing open hat
// so the next hit can fade it out cleanly instead of clicking.
let activeOpenHat = null;

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, open?: boolean, velocity? }
 */
export function play(ctx, destination, time, params) {
  const open = params.open ?? false;
  const velocity = params.velocity ?? 0.7;
  const decayTime = open ? 0.420 : 0.045;

  // Ensure noise buffer exists
  initNoise(ctx);

  // Choke: if an open hat is ringing and a new hat fires, fade it out
  if (activeOpenHat) {
    const { gainNode, source } = activeOpenHat;
    gainNode.gain.cancelScheduledValues(time);
    gainNode.gain.setValueAtTime(gainNode.gain.value, time);
    gainNode.gain.linearRampToValueAtTime(0, time + 0.020); // 20ms fade
    try { source.stop(time + 0.025); } catch (e) { /* already stopped */ }
    activeOpenHat = null;
  }

  // Noise source
  const noiseSrc = createNoiseSource(ctx, time);

  // Filter chain: highpass → bandpass for metallic character
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 10500;
  bp.Q.value = 1.2;

  // Single unbroken envelope chain.
  const gain = ctx.createGain();
  // 0.4 base gain — the HP+BP filter chain eats ~12dB of signal,
  // so raw gain needs to be higher to maintain presence.
  const level = 0.4 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.002);                  // 2ms attack
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.002 + decayTime); // exponential decay
  gain.gain.setValueAtTime(0, time + 0.002 + decayTime);                   // snap to zero

  noiseSrc.connect(hp).connect(bp).connect(gain).connect(destination);
  noiseSrc.stop(time + decayTime + 0.05);

  // Track open hats for choke logic
  if (open) {
    activeOpenHat = { gainNode: gain, source: noiseSrc };
  }

  // Cleanup
  noiseSrc.onended = () => {
    noiseSrc.disconnect();
    hp.disconnect();
    bp.disconnect();
    gain.disconnect();
    if (activeOpenHat && activeOpenHat.source === noiseSrc) {
      activeOpenHat = null;
    }
  };
}
