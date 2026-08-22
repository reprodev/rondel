// Patch codec — compact binary serialisation for URL sharing.
// Encodes the live patch state into ~80-120 characters of base64url.
// Includes a Fletcher-8 checksum to detect corruption.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const VALID_SCALES = ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'pentatonic', 'blues', 'chromatic'];
const VALID_VOICES = ['kick', 'snare', 'hat', 'bass', 'poly'];
const VERSION = 1;

// --- Base64url ---

function toBase64url(bytes) {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const a = bytes[i];
    const b = i + 1 < len ? bytes[i + 1] : 0;
    const c = i + 2 < len ? bytes[i + 2] : 0;
    result += B64[a >> 2];
    result += B64[((a & 3) << 4) | (b >> 4)];
    if (i + 1 < len) result += B64[((b & 15) << 2) | (c >> 6)];
    if (i + 2 < len) result += B64[c & 63];
  }
  return result;
}

function fromBase64url(str) {
  // Pad to multiple of 4 for standard decoding
  const padded = str + '==='.slice(0, (4 - str.length % 4) % 4);
  const out = [];
  for (let i = 0; i < padded.length; i += 4) {
    const a = B64.indexOf(padded[i]);
    const b = B64.indexOf(padded[i + 1]);
    const c = padded[i + 2] === '=' ? -1 : B64.indexOf(padded[i + 2]);
    const d = padded[i + 3] === '=' ? -1 : B64.indexOf(padded[i + 3]);
    if (a < 0 || b < 0) return null;

    out.push((a << 2) | (b >> 4));
    if (c >= 0) out.push(((b & 15) << 4) | (c >> 2));
    if (d >= 0) out.push(((c & 3) << 6) | d);
  }
  return new Uint8Array(out);
}

// --- Fletcher-8 checksum ---

function fletcher8(bytes) {
  let sum1 = 0, sum2 = 0;
  for (let i = 0; i < bytes.length; i++) {
    sum1 = (sum1 + bytes[i]) % 255;
    sum2 = (sum2 + sum1) % 255;
  }
  return (sum2 << 8) | sum1;
}

// --- Encode/Decode ---

/**
 * Encode a patch into a compact base64url string (~80-120 chars).
 * Layout:
 *   [version:1][bpm-40:1][root:1][scaleId:1][seed:4 bytes LE][masterGain*100:1]
 *   per ring (5x): [voiceId:1][steps:1][pulses:1][rotation:1][prob*100:1][gain*100:1][delay*100:1][reverb*100:1]
 *   [fletcher8 checksum: 2 bytes]
 */
export function encodePatch(patch) {
  if (!patch || !patch.rings || patch.rings.length !== 5) return null;

  const buf = [];

  // Header
  buf.push(VERSION);
  buf.push(Math.max(0, Math.min(255, (patch.bpm || 120) - 40)));
  buf.push(Math.max(0, Math.min(127, patch.root || 60)));
  buf.push(Math.max(0, Math.min(8, VALID_SCALES.indexOf(patch.scale || 'major'))));

  // Seed as 4 bytes LE
  const seed = (patch.seed || 0) >>> 0;
  buf.push(seed & 0xFF);
  buf.push((seed >> 8) & 0xFF);
  buf.push((seed >> 16) & 0xFF);
  buf.push((seed >> 24) & 0xFF);

  // Master gain
  buf.push(Math.round((patch.masterGain ?? 0.7) * 100));

  // Rings (5x 8 bytes = 40 bytes)
  for (let i = 0; i < 5; i++) {
    const ring = patch.rings[i];
    buf.push(Math.max(0, Math.min(4, VALID_VOICES.indexOf(ring.voice || 'kick'))));
    buf.push(Math.max(1, Math.min(32, ring.steps || 16)));
    buf.push(Math.max(0, Math.min(32, ring.pulses || 0)));
    buf.push(Math.max(0, Math.min(31, ring.rotation || 0)));
    buf.push(Math.round((ring.probability ?? 1.0) * 100));
    buf.push(Math.round((ring.gain ?? 0.8) * 100));
    buf.push(Math.round((ring.delaySend ?? 0.2) * 100));
    buf.push(Math.round((ring.reverbSend ?? 0.3) * 100));
  }

  // Fletcher-8 checksum
  const data = new Uint8Array(buf);
  const checksum = fletcher8(data);
  buf.push(checksum & 0xFF);
  buf.push((checksum >> 8) & 0xFF);

  return toBase64url(new Uint8Array(buf));
}

/**
 * Decode a base64url string back into a patch object.
 * Returns null on any error (bad format, bad checksum, invalid data).
 */
export function decodePatch(encoded) {
  if (!encoded || typeof encoded !== 'string' || encoded.length < 10) return null;

  try {
    const bytes = fromBase64url(encoded);
    if (!bytes || bytes.length < 51) return null; // 9 header + 40 rings + 2 checksum = 51

    // Verify checksum
    const data = bytes.slice(0, bytes.length - 2);
    const storedChecksum = bytes[bytes.length - 2] | (bytes[bytes.length - 1] << 8);
    if (fletcher8(data) !== storedChecksum) return null;

    let offset = 0;
    const version = bytes[offset++];
    if (version !== VERSION) return null;

    const bpm = bytes[offset++] + 40;
    const root = bytes[offset++];
    const scaleId = bytes[offset++];
    const scale = VALID_SCALES[scaleId] || 'major';

    const seed = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
    offset += 4;

    const masterGain = bytes[offset++] / 100;

    const rings = [];
    for (let i = 0; i < 5; i++) {
      const voiceId = bytes[offset++];
      const steps = bytes[offset++];
      const pulses = bytes[offset++];
      const rotation = bytes[offset++];
      const probability = bytes[offset++] / 100;
      const gain = bytes[offset++] / 100;
      const delaySend = bytes[offset++] / 100;
      const reverbSend = bytes[offset++] / 100;

      rings.push({
        voice: VALID_VOICES[voiceId] || 'kick',
        steps: Math.max(1, Math.min(32, steps)),
        pulses: Math.max(0, Math.min(steps, pulses)),
        rotation: Math.max(0, Math.min(steps - 1, rotation)),
        probability: Math.max(0, Math.min(1, probability)),
        gain: Math.max(0, Math.min(1, gain)),
        delaySend: Math.max(0, Math.min(1, delaySend)),
        reverbSend: Math.max(0, Math.min(1, reverbSend)),
      });
    }

    return {
      bpm,
      root,
      scale,
      seed: seed >>> 0,
      masterGain,
      rings,
      arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
    };
  } catch (e) {
    return null;
  }
}

// --- URL Hash sync ---

let hashTimeout = null;

/**
 * Update location.hash with encoded patch. Debounced 400ms to avoid
 * thrashing the address bar during rapid edits.
 */
export function syncHashWithPatch(patch) {
  if (typeof window === 'undefined') return;
  clearTimeout(hashTimeout);
  hashTimeout = setTimeout(() => {
    const encoded = encodePatch(patch);
    if (encoded) {
      history.replaceState(null, '', '#' + encoded);
    }
  }, 400);
}

/**
 * Read hash from URL, decode if valid. Returns patch or null.
 */
export function loadPatchFromHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1); // remove #
  if (!hash) return null;
  return decodePatch(hash);
}

// --- localStorage fallback ---

const STORAGE_KEY = 'rondel-patch';

/**
 * Save patch to localStorage as a backup.
 */
export function savePatchToStorage(patch) {
  try {
    const encoded = encodePatch(patch);
    if (encoded) localStorage.setItem(STORAGE_KEY, encoded);
  } catch (e) { /* localStorage unavailable */ }
}

/**
 * Load patch from localStorage. Returns patch or null.
 */
export function loadPatchFromStorage() {
  try {
    const encoded = localStorage.getItem(STORAGE_KEY);
    if (!encoded) return null;
    return decodePatch(encoded);
  } catch (e) { return null; }
}
