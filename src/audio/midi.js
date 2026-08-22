// Standard MIDI File (format 0) export — converts beat-based note data to SMF bytes.

/**
 * Encode a value as a MIDI variable-length quantity.
 * VLQ uses 7 bits per byte with bit 7 as continuation flag — compact encoding
 * for the delta-times that dominate MIDI file size.
 *
 * @param {number} value Non-negative integer
 * @returns {Uint8Array}
 */
export function encodeVarLen(value) {
  if (value < 0) throw new RangeError('VLQ value must be non-negative');

  const bytes = [];
  bytes.push(value & 0x7F);
  value >>>= 7;

  while (value > 0) {
    bytes.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }

  bytes.reverse();
  return new Uint8Array(bytes);
}

/**
 * Decode a MIDI variable-length quantity starting at offset.
 *
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @returns {{ value: number, bytesRead: number }}
 */
export function decodeVarLen(bytes, offset) {
  let value = 0;
  let bytesRead = 0;

  while (true) {
    const b = bytes[offset + bytesRead];
    value = (value << 7) | (b & 0x7F);
    bytesRead++;
    if ((b & 0x80) === 0) break;
  }

  return { value, bytesRead };
}

/**
 * Build a MIDI tempo meta-event (FF 51 03 tt tt tt).
 * Tempo is stored as microseconds-per-beat so that integer arithmetic
 * avoids floating-point drift in sequencers.
 *
 * @param {number} bpm Beats per minute
 * @returns {Uint8Array}
 */
export function tempoEvent(bpm) {
  const microsPerBeat = Math.round(60000000 / bpm);
  return new Uint8Array([
    0xFF, 0x51, 0x03,
    (microsPerBeat >> 16) & 0xFF,
    (microsPerBeat >> 8) & 0xFF,
    microsPerBeat & 0xFF
  ]);
}

/**
 * Encode note data into a Standard MIDI File (format 0, single track).
 * All input tracks are merged into one MTrk — format 0 keeps playback
 * simple for hardware synths that only read one track.
 *
 * @param {{ bpm: number, tracks: Array<{ notes: Array<{ pitch: number, start: number, duration: number, velocity: number }> }>, ticksPerBeat?: number }} options
 * @returns {Uint8Array}
 */
export function encodeMidi({ bpm, tracks, ticksPerBeat = 480 }) {
  // Collect all note events and convert to absolute ticks
  const events = [];

  for (const track of tracks) {
    for (const note of track.notes) {
      const startTick = Math.round(note.start * ticksPerBeat);
      const endTick = Math.round((note.start + note.duration) * ticksPerBeat);

      events.push({ tick: startTick, type: 'on', pitch: note.pitch, velocity: note.velocity });
      events.push({ tick: endTick, type: 'off', pitch: note.pitch, velocity: 0 });
    }
  }

  // Sort by tick; note-offs before note-ons at same tick to avoid hanging notes
  events.sort((a, b) => a.tick - b.tick || (a.type === 'off' ? -1 : 1));

  // Build track data
  const trackBytes = [];

  // Tempo event at tick 0 (delta = 0)
  const tempo = tempoEvent(bpm);
  trackBytes.push(0x00); // delta time
  for (const b of tempo) trackBytes.push(b);

  // Note events
  let prevTick = 0;
  for (const evt of events) {
    const delta = evt.tick - prevTick;
    const deltaBytes = encodeVarLen(delta);
    for (const b of deltaBytes) trackBytes.push(b);

    const status = evt.type === 'on' ? 0x90 : 0x80;
    trackBytes.push(status);
    trackBytes.push(evt.pitch & 0x7F);
    trackBytes.push(evt.velocity & 0x7F);

    prevTick = evt.tick;
  }

  // End of track meta event
  trackBytes.push(0x00); // delta
  trackBytes.push(0xFF, 0x2F, 0x00);

  const trackData = new Uint8Array(trackBytes);

  // Assemble file: MThd (14 bytes) + MTrk (8 + trackData.length)
  const fileSize = 14 + 8 + trackData.length;
  const out = new Uint8Array(fileSize);
  const view = new DataView(out.buffer);

  // MThd header
  writeString(out, 0, 'MThd');
  view.setUint32(4, 6, false);            // header length
  view.setUint16(8, 0, false);            // format 0
  view.setUint16(10, 1, false);           // 1 track
  view.setUint16(12, ticksPerBeat, false);

  // MTrk chunk
  writeString(out, 14, 'MTrk');
  view.setUint32(18, trackData.length, false);
  out.set(trackData, 22);

  return out;
}

// -- internal helpers --

function writeString(out, offset, str) {
  for (let i = 0; i < str.length; i++) {
    out[offset + i] = str.charCodeAt(i);
  }
}
