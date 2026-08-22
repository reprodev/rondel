// Binary ↔ base64url codec for compact patch state serialisation.
// Uses Uint8Array throughout — no Buffer dependency, runs in any ES environment.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Standard base64 with URL-safe alphabet (+ → -, / → _) and no padding.
 * Keeping patch URLs short and copy-pasteable.
 */
export function encodeBase64url(bytes) {
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
  return result.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Reverses encodeBase64url — restores padding before decoding so that
 * standard base64 tables can be reused without branching.
 */
export function decodeBase64url(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4 !== 0) s += '=';

  const out = [];
  for (let i = 0; i < s.length; i += 4) {
    const a = B64.indexOf(s[i]);
    const b = B64.indexOf(s[i + 1]);
    const c = s[i + 2] === '=' ? 0 : B64.indexOf(s[i + 2]);
    const d = s[i + 3] === '=' ? 0 : B64.indexOf(s[i + 3]);

    out.push((a << 2) | (b >> 4));
    if (s[i + 2] !== '=') out.push(((b & 15) << 4) | (c >> 2));
    if (s[i + 3] !== '=') out.push(((c & 3) << 6) | d);
  }
  return new Uint8Array(out);
}

/**
 * Packs booleans into bytes MSB-first. The last byte is zero-padded
 * on the right so that unpackBits can recover the exact count later.
 */
export function packBits(booleans) {
  const byteCount = Math.ceil(booleans.length / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < booleans.length; i++) {
    if (booleans[i]) {
      bytes[i >> 3] |= (1 << (7 - (i & 7)));
    }
  }
  return bytes;
}

/**
 * Unpacks exactly `count` booleans from packed bytes. The caller must
 * know the original count — the packed format does not store it.
 */
export function unpackBits(bytes, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push((bytes[i >> 3] & (1 << (7 - (i & 7)))) !== 0);
  }
  return result;
}

/**
 * LEB128 unsigned encoding — variable-length integers keep small values
 * compact (1 byte for 0-127) while still supporting large ranges.
 */
export function encodeVarInt(value) {
  const bytes = [];
  do {
    let byte = value & 0x7F;
    value >>>= 7;
    if (value !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (value !== 0);
  return new Uint8Array(bytes);
}

/**
 * Decodes a single LEB128 varint starting at the given offset.
 * Returns both the decoded value and how many bytes were consumed.
 */
export function decodeVarInt(bytes, offset) {
  let value = 0;
  let shift = 0;
  let bytesRead = 0;
  while (true) {
    const byte = bytes[offset + bytesRead];
    value |= (byte & 0x7F) << shift;
    bytesRead++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  return { value, bytesRead };
}

/**
 * Encodes a full patch into a compact base64url string.
 * Layout: [bpm-40][swing][trackCount] then per track:
 * [stepsLen][packedBits...][pulses][rotation+128][velocity]
 */
export function encodePatch(patch) {
  const parts = [];

  parts.push(patch.bpm - 40);
  parts.push(patch.swing);
  parts.push(patch.tracks.length);

  for (const track of patch.tracks) {
    const stepsLen = track.steps.length;
    parts.push(stepsLen);
    const packed = packBits(track.steps);
    for (let i = 0; i < packed.length; i++) parts.push(packed[i]);
    parts.push(track.pulses);
    parts.push(track.rotation + 128);
    parts.push(track.velocity);
  }

  return encodeBase64url(new Uint8Array(parts));
}

/**
 * Reverses encodePatch — reconstructs the patch object from a
 * base64url-encoded binary blob.
 */
export function decodePatch(encoded) {
  const bytes = decodeBase64url(encoded);
  let offset = 0;

  const bpm = bytes[offset++] + 40;
  const swing = bytes[offset++];
  const trackCount = bytes[offset++];

  const tracks = [];
  for (let t = 0; t < trackCount; t++) {
    const stepsLen = bytes[offset++];
    const packedByteCount = Math.ceil(stepsLen / 8);
    const steps = unpackBits(bytes.slice(offset, offset + packedByteCount), stepsLen);
    offset += packedByteCount;
    const pulses = bytes[offset++];
    const rotation = bytes[offset++] - 128;
    const velocity = bytes[offset++];
    tracks.push({ steps, pulses, rotation, velocity });
  }

  return { bpm, swing, tracks };
}
