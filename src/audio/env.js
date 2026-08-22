// Web Audio gain envelope helpers — schedule click-free attack/decay
// automation on any AudioParam without coupling to a specific context.

/**
 * Clamp a value to the minimum safe threshold for exponentialRampToValueAtTime.
 * The Web Audio spec requires exponential targets to be strictly positive;
 * passing 0 or negative values causes the ramp to throw or produce NaN.
 *
 * @param {number} value
 * @returns {number}
 */
export function floor(value) {
  return value > 0.0001 ? value : 0.0001;
}

/**
 * Schedule a linear attack ramp on an AudioParam.
 * Linear ramps avoid the perceptual "slow start" of exponential curves,
 * giving a more immediate onset — closer to how acoustic transients behave.
 *
 * @param {AudioContext} ctx - Reserved for future use (API consistency).
 * @param {AudioParam} param - The param to automate (gain, frequency, etc.).
 * @param {number} time - Automation start time (context time).
 * @param {number} targetValue - Value to ramp toward.
 * @param {number} durationSec - Ramp duration in seconds.
 */
export function attack(ctx, param, time, targetValue, durationSec) {
  param.cancelScheduledValues(time);
  param.setValueAtTime(param.value, time);
  param.linearRampToValueAtTime(targetValue, time + durationSec);
}

/**
 * Schedule an exponential decay ramp on an AudioParam.
 * Exponential curves model natural energy dissipation (string damping,
 * room absorption) far better than linear slopes — they sound "real".
 * If the target is effectively zero we snap to true 0 after the ramp
 * completes so the param doesn't linger at the floor indefinitely.
 *
 * @param {AudioContext} ctx - Reserved for future use (API consistency).
 * @param {AudioParam} param - The param to automate.
 * @param {number} time - Automation start time (context time).
 * @param {number} targetValue - Desired end value (will be floored for safety).
 * @param {number} durationSec - Ramp duration in seconds.
 */
export function decay(ctx, param, time, targetValue, durationSec) {
  const safeTarget = floor(targetValue);
  param.cancelScheduledValues(time);
  param.setValueAtTime(param.value, time);
  param.exponentialRampToValueAtTime(safeTarget, time + durationSec);

  // Snap to true zero once the ramp finishes — prevents the param from
  // hovering at the inaudible floor value and wasting downstream processing.
  if (targetValue <= 0.0001) {
    param.setValueAtTime(0, time + durationSec);
  }
}
