// Deterministic PRNG utilities — every random decision flows through an
// injected rng function so sequences are perfectly reproducible from a seed.

/**
 * Mulberry32 — fast 32-bit PRNG with excellent avalanche properties.
 * Returns a closure that yields the next float in [0, 1) on each call.
 */
export function mulberry32(seed) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * FNV-1a 32-bit hash — deterministic string → number mapping used to
 * derive per-track seeds from human-readable names.
 */
export function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Integer in [min, max] inclusive, drawn from the injected rng.
 */
export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Fisher-Yates shuffle — returns a new array so the caller's data stays intact.
 */
export function shuffle(rng, array) {
  const out = array.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
