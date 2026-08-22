// WAV file encoding — 16-bit PCM, pure computation with no platform deps.

/**
 * Encode audio channels into a complete WAV file (RIFF/WAVE container).
 * Uses 16-bit signed PCM which balances quality and size for offline export.
 *
 * @param {{ sampleRate: number, channels: Float32Array[] }} options
 * @returns {Uint8Array} Complete WAV file bytes
 */
export function encodeWav({ sampleRate, channels }) {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const dataSize = numSamples * numChannels * 2;
  const fileSize = 44 + dataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const out = new Uint8Array(buffer);

  // RIFF header
  writeString(out, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(out, 8, 'WAVE');

  // fmt sub-chunk
  writeString(out, 12, 'fmt ');
  view.setUint32(16, 16, true);           // chunk size
  view.setUint16(20, 1, true);            // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true);              // block align
  view.setUint16(34, 16, true);           // bits per sample

  // data sub-chunk
  writeString(out, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleaved 16-bit samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const clamped = Math.max(-1, Math.min(1, channels[ch][i]));
      const scaled = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
      view.setInt16(offset, Math.round(scaled), true);
      offset += 2;
    }
  }

  return out;
}

/**
 * Read duration in seconds from a WAV file header.
 * Relies on the standard 44-byte header layout — fast O(1) read.
 */
export function wavDuration(wav) {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  const dataSize = view.getUint32(40, true);
  const byteRate = view.getUint32(28, true);
  return dataSize / byteRate;
}

/**
 * Read sample rate from a WAV file header.
 */
export function wavSampleRate(wav) {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  return view.getUint32(24, true);
}

/**
 * Read channel count from a WAV file header.
 */
export function wavChannelCount(wav) {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  return view.getUint16(22, true);
}

// -- internal helpers --

function writeString(out, offset, str) {
  for (let i = 0; i < str.length; i++) {
    out[offset + i] = str.charCodeAt(i);
  }
}
