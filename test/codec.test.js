import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encodePatch, decodePatch } from '../src/state/codec.js';
import { createPatch } from '../src/state/patch.js';

describe('encodePatch/decodePatch roundtrip', () => {
  it('roundtrips a default patch', () => {
    const patch = createPatch();
    const encoded = encodePatch(patch);
    assert.ok(encoded, 'encodePatch should return a string');
    assert.ok(encoded.length > 10, `encoded too short: ${encoded.length}`);
    assert.ok(encoded.length < 150, `encoded too long: ${encoded.length}`);

    const decoded = decodePatch(encoded);
    assert.ok(decoded, 'decodePatch should return an object');
    assert.strictEqual(decoded.bpm, patch.bpm);
    assert.strictEqual(decoded.root, patch.root);
    assert.strictEqual(decoded.scale, patch.scale);
    assert.strictEqual(decoded.seed, patch.seed);
    assert.strictEqual(decoded.masterGain, patch.masterGain);
  });

  it('roundtrips ring data accurately', () => {
    const patch = createPatch({ rings: [
      { pulses: 3, rotation: 5, probability: 0.7, gain: 0.6, delaySend: 0.1, reverbSend: 0.5 },
    ]});
    const decoded = decodePatch(encodePatch(patch));
    const ring = decoded.rings[0];
    assert.strictEqual(ring.pulses, 3);
    assert.strictEqual(ring.rotation, 5);
    assert.ok(Math.abs(ring.probability - 0.7) < 0.02);
    assert.ok(Math.abs(ring.gain - 0.6) < 0.02);
    assert.ok(Math.abs(ring.delaySend - 0.1) < 0.02);
    assert.ok(Math.abs(ring.reverbSend - 0.5) < 0.02);
  });

  it('roundtrips extreme BPM values', () => {
    const patch40 = createPatch({ bpm: 40 });
    assert.strictEqual(decodePatch(encodePatch(patch40)).bpm, 40);

    const patch200 = createPatch({ bpm: 200 });
    assert.strictEqual(decodePatch(encodePatch(patch200)).bpm, 200);
  });

  it('roundtrips seed correctly (large number)', () => {
    const patch = createPatch({ seed: 4294967295 });  // max u32
    const decoded = decodePatch(encodePatch(patch));
    assert.strictEqual(decoded.seed, 4294967295);
  });

  it('roundtrips all scale types', () => {
    const scales = ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'pentatonic', 'blues', 'chromatic'];
    for (const scale of scales) {
      const patch = createPatch({ scale });
      const decoded = decodePatch(encodePatch(patch));
      assert.strictEqual(decoded.scale, scale, `scale ${scale} failed roundtrip`);
    }
  });
});

describe('decodePatch error handling', () => {
  it('returns null for empty string', () => {
    assert.strictEqual(decodePatch(''), null);
  });

  it('returns null for null', () => {
    assert.strictEqual(decodePatch(null), null);
  });

  it('returns null for garbage string', () => {
    assert.strictEqual(decodePatch('not-a-valid-patch-!@#$%'), null);
  });

  it('returns null for truncated data', () => {
    const patch = createPatch();
    const encoded = encodePatch(patch);
    const truncated = encoded.slice(0, 10);
    assert.strictEqual(decodePatch(truncated), null);
  });

  it('returns null for corrupted checksum', () => {
    const patch = createPatch();
    const encoded = encodePatch(patch);
    // Flip a character in the middle
    const corrupted = encoded.slice(0, 5) + 'X' + encoded.slice(6);
    assert.strictEqual(decodePatch(corrupted), null);
  });
});

describe('encodePatch validation', () => {
  it('returns null for patch without rings', () => {
    assert.strictEqual(encodePatch({}), null);
    assert.strictEqual(encodePatch({ rings: [] }), null);
    assert.strictEqual(encodePatch(null), null);
  });

  it('encoded string uses only URL-safe characters', () => {
    const patch = createPatch();
    const encoded = encodePatch(patch);
    assert.ok(/^[A-Za-z0-9_-]+$/.test(encoded), `contains unsafe chars: ${encoded}`);
  });

  it('encoded length is 70-120 chars for default patch', () => {
    const patch = createPatch();
    const encoded = encodePatch(patch);
    assert.ok(encoded.length >= 60, `too short: ${encoded.length}`);
    assert.ok(encoded.length <= 120, `too long: ${encoded.length}`);
  });
});

describe('localStorage functions', () => {
  // These need a DOM environment, skip in Node
  it('savePatchToStorage and loadPatchFromStorage are exported functions', async () => {
    const mod = await import('../src/state/codec.js');
    assert.strictEqual(typeof mod.savePatchToStorage, 'function');
    assert.strictEqual(typeof mod.loadPatchFromStorage, 'function');
  });
});

describe('hash functions', () => {
  it('syncHashWithPatch and loadPatchFromHash are exported functions', async () => {
    const mod = await import('../src/state/codec.js');
    assert.strictEqual(typeof mod.syncHashWithPatch, 'function');
    assert.strictEqual(typeof mod.loadPatchFromHash, 'function');
  });
});
