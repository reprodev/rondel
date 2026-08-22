// White noise buffer — shared per AudioContext via WeakMap so it's generated
// once and garbage-collected if the context goes away.

// Use a WeakMap so noise buffers are garbage-collected if the AudioContext is.
const noiseCache = new WeakMap();

/**
 * Generate a 2-second stereo white noise buffer and cache it on `ctx`.
 * Idempotent — returns the existing buffer if already initialized.
 *
 * @param {AudioContext} ctx
 * @returns {AudioBuffer}
 */
export function initNoise(ctx) {
  if (noiseCache.has(ctx)) return noiseCache.get(ctx);

  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 2; // 2 seconds
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  noiseCache.set(ctx, buffer);
  return buffer;
}

/**
 * Retrieve the cached noise buffer for a given context.
 * Throws if initNoise hasn't been called yet — fail loud so callers
 * know they missed the setup step rather than getting silent silence.
 *
 * @param {AudioContext} ctx
 * @returns {AudioBuffer}
 */
export function getNoise(ctx) {
  const buffer = noiseCache.get(ctx);
  if (!buffer) throw new Error('Noise not initialized — call initNoise(ctx) first');
  return buffer;
}

/**
 * Create a started BufferSourceNode playing the cached noise from a random
 * offset. The random start prevents phase-locking when many hits overlap.
 * Caller is responsible for connecting and stopping the source.
 *
 * @param {AudioContext} ctx
 * @param {number} time — audioContext time at which to start playback
 * @returns {AudioBufferSourceNode}
 */
export function createNoiseSource(ctx, time) {
  const buffer = getNoise(ctx);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = 1.0;

  // Random offset in [0, 1.8] so there's always at least 0.2s of runway
  // before the buffer ends, and repeated hits don't phase-lock.
  const offset = Math.random() * 1.8;
  source.start(time, offset);

  return source;
}
