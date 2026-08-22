import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  encodeBase64url, decodeBase64url,
  packBits, unpackBits,
  encodeVarInt, decodeVarInt,
  encodePatch, decodePatch
} from '../src/state/codec.js';

describe('base64url roundtrip', () => {
  const cases = [
    new Uint8Array([]),
    new Uint8Array([0]),
    new Uint8Array([255]),
    new Uint8Array([72, 101, 108, 108, 111]),
    new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    new Uint8Array(256).map((_, i) => i % 256),
  ];

  for (const bytes of cases) {
    it(`roundtrips ${bytes.length} byte(s)`, () => {
      const encoded = encodeBase64url(bytes);
      const decoded = decodeBase64url(encoded);
      assert.deepStrictEqual(decoded, bytes);
    });
  }
});

describe('base64url known-answer', () => {
  it('encodes "Hello" without padding', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]);
    assert.strictEqual(encodeBase64url(bytes), 'SGVsbG8');
  });

  it('uses - instead of + and _ instead of /', () => {
    // 0xFB, 0xFF, 0xFE produces +/in standard base64
    const bytes = new Uint8Array([0xFB, 0xFF, 0xFE]);
    const encoded = encodeBase64url(bytes);
    assert.ok(!encoded.includes('+'), 'should not contain +');
    assert.ok(!encoded.includes('/'), 'should not contain /');
    assert.ok(!encoded.includes('='), 'should not contain padding');
  });
});

describe('packBits/unpackBits roundtrip', () => {
  it('roundtrips 8 booleans', () => {
    const bits = [true, false, true, true, false, false, true, false];
    const packed = packBits(bits);
    const unpacked = unpackBits(packed, bits.length);
    assert.deepStrictEqual(unpacked, bits);
  });

  it('roundtrips non-byte-aligned count (5 bits)', () => {
    const bits = [true, true, false, true, false];
    const packed = packBits(bits);
    const unpacked = unpackBits(packed, bits.length);
    assert.deepStrictEqual(unpacked, bits);
  });

  it('roundtrips empty array', () => {
    const packed = packBits([]);
    assert.strictEqual(packed.length, 0);
    assert.deepStrictEqual(unpackBits(packed, 0), []);
  });

  it('roundtrips 16 booleans (2 bytes)', () => {
    const bits = Array(16).fill(false).map((_, i) => i % 3 === 0);
    const packed = packBits(bits);
    assert.strictEqual(packed.length, 2);
    assert.deepStrictEqual(unpackBits(packed, 16), bits);
  });
});

describe('packBits known-answer', () => {
  it('[t,f,t,t,f,f,t,f] packs to [178]', () => {
    const bits = [true, false, true, true, false, false, true, false];
    const packed = packBits(bits);
    assert.deepStrictEqual(packed, new Uint8Array([0b10110010]));
    assert.strictEqual(packed[0], 178);
  });
});

describe('VarInt roundtrip', () => {
  const values = [0, 1, 127, 128, 16384, 2097152];

  for (const v of values) {
    it(`roundtrips ${v}`, () => {
      const encoded = encodeVarInt(v);
      const { value, bytesRead } = decodeVarInt(encoded, 0);
      assert.strictEqual(value, v);
      assert.strictEqual(bytesRead, encoded.length);
    });
  }
});

describe('VarInt known-answer', () => {
  it('encodeVarInt(300) = [0xAC, 0x02]', () => {
    const encoded = encodeVarInt(300);
    assert.deepStrictEqual(encoded, new Uint8Array([0xAC, 0x02]));
  });

  it('encodeVarInt(0) = [0x00]', () => {
    assert.deepStrictEqual(encodeVarInt(0), new Uint8Array([0x00]));
  });

  it('encodeVarInt(127) = [0x7F]', () => {
    assert.deepStrictEqual(encodeVarInt(127), new Uint8Array([0x7F]));
  });

  it('encodeVarInt(128) = [0x80, 0x01]', () => {
    assert.deepStrictEqual(encodeVarInt(128), new Uint8Array([0x80, 0x01]));
  });
});

describe('decodeVarInt at offset', () => {
  it('decodes from middle of a byte array', () => {
    // Prefix byte + varint(300) + suffix byte
    const buf = new Uint8Array([0xFF, 0xAC, 0x02, 0xFF]);
    const { value, bytesRead } = decodeVarInt(buf, 1);
    assert.strictEqual(value, 300);
    assert.strictEqual(bytesRead, 2);
  });
});

describe('encodePatch/decodePatch roundtrip', () => {
  it('roundtrips a realistic patch', () => {
    const patch = {
      bpm: 120,
      swing: 50,
      tracks: [
        { steps: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false], pulses: 5, rotation: 0, velocity: 100 },
        { steps: [true, false, true, false, true, false, true, false], pulses: 4, rotation: -2, velocity: 80 },
        { steps: Array(32).fill(false).map((_, i) => i % 4 === 0), pulses: 8, rotation: 3, velocity: 64 },
      ]
    };

    const encoded = encodePatch(patch);
    const decoded = decodePatch(encoded);

    assert.strictEqual(decoded.bpm, patch.bpm);
    assert.strictEqual(decoded.swing, patch.swing);
    assert.strictEqual(decoded.tracks.length, patch.tracks.length);
    for (let i = 0; i < patch.tracks.length; i++) {
      assert.deepStrictEqual(decoded.tracks[i].steps, patch.tracks[i].steps);
      assert.strictEqual(decoded.tracks[i].pulses, patch.tracks[i].pulses);
      assert.strictEqual(decoded.tracks[i].rotation, patch.tracks[i].rotation);
      assert.strictEqual(decoded.tracks[i].velocity, patch.tracks[i].velocity);
    }
  });

  it('encoded string contains only base64url chars', () => {
    const patch = { bpm: 80, swing: 0, tracks: [{ steps: [true, false], pulses: 1, rotation: 0, velocity: 127 }] };
    const encoded = encodePatch(patch);
    assert.ok(/^[A-Za-z0-9_-]*$/.test(encoded), 'must be valid base64url');
  });
});

describe('encodePatch/decodePatch edge cases', () => {
  it('empty tracks array', () => {
    const patch = { bpm: 40, swing: 0, tracks: [] };
    const decoded = decodePatch(encodePatch(patch));
    assert.strictEqual(decoded.bpm, 40);
    assert.strictEqual(decoded.swing, 0);
    assert.deepStrictEqual(decoded.tracks, []);
  });

  it('single track with 0 steps', () => {
    const patch = { bpm: 300, swing: 100, tracks: [{ steps: [], pulses: 0, rotation: 0, velocity: 0 }] };
    const decoded = decodePatch(encodePatch(patch));
    assert.strictEqual(decoded.tracks.length, 1);
    assert.deepStrictEqual(decoded.tracks[0].steps, []);
    assert.strictEqual(decoded.tracks[0].pulses, 0);
  });
});
