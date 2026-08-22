import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encodeVarLen, decodeVarLen, tempoEvent, encodeMidi } from '../src/audio/midi.js';

describe('encodeVarLen known-answer tests', () => {
  it('0 encodes to [0x00]', () => {
    assert.deepStrictEqual([...encodeVarLen(0)], [0x00]);
  });

  it('127 encodes to [0x7F]', () => {
    assert.deepStrictEqual([...encodeVarLen(127)], [0x7F]);
  });

  it('128 encodes to [0x81, 0x00]', () => {
    assert.deepStrictEqual([...encodeVarLen(128)], [0x81, 0x00]);
  });

  it('16383 encodes to [0xFF, 0x7F]', () => {
    assert.deepStrictEqual([...encodeVarLen(16383)], [0xFF, 0x7F]);
  });
});

describe('encodeVarLen/decodeVarLen roundtrip', () => {
  const values = [0, 127, 128, 16383, 16384, 2097151];

  for (const v of values) {
    it(`roundtrips ${v}`, () => {
      const encoded = encodeVarLen(v);
      const { value, bytesRead } = decodeVarLen(encoded, 0);
      assert.strictEqual(value, v);
      assert.strictEqual(bytesRead, encoded.length);
    });
  }
});

describe('tempoEvent', () => {
  it('120 BPM produces microsPerBeat = 500000 (FF 51 03 07 A1 20)', () => {
    const evt = tempoEvent(120);
    assert.deepStrictEqual([...evt], [0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20]);
  });
});

describe('encodeMidi header structure', () => {
  const midi = encodeMidi({ bpm: 120, tracks: [{ notes: [] }] });

  it('starts with "MThd"', () => {
    const header = String.fromCharCode(...midi.slice(0, 4));
    assert.strictEqual(header, 'MThd');
  });

  it('contains "MTrk" after MThd', () => {
    const mtrk = String.fromCharCode(...midi.slice(14, 18));
    assert.strictEqual(mtrk, 'MTrk');
  });

  it('MThd chunk is 14 bytes total (4 id + 4 length + 6 data)', () => {
    const view = new DataView(midi.buffer, midi.byteOffset, midi.byteLength);
    assert.strictEqual(view.getUint32(4, false), 6); // header data length
  });

  it('format is 0', () => {
    const view = new DataView(midi.buffer, midi.byteOffset, midi.byteLength);
    assert.strictEqual(view.getUint16(8, false), 0);
  });

  it('track count is 1', () => {
    const view = new DataView(midi.buffer, midi.byteOffset, midi.byteLength);
    assert.strictEqual(view.getUint16(10, false), 1);
  });
});

describe('encodeMidi empty notes produces valid file', () => {
  const midi = encodeMidi({ bpm: 120, tracks: [{ notes: [] }] });

  it('file size is MThd(14) + MTrk header(8) + track data', () => {
    const view = new DataView(midi.buffer, midi.byteOffset, midi.byteLength);
    const trackLen = view.getUint32(18, false);
    assert.strictEqual(midi.byteLength, 14 + 8 + trackLen);
  });

  it('ends with end-of-track event (FF 2F 00)', () => {
    const tail = [...midi.slice(-3)];
    assert.deepStrictEqual(tail, [0xFF, 0x2F, 0x00]);
  });
});

describe('encodeMidi single note', () => {
  // C4 (pitch 60), beat 0, duration 1 beat, velocity 100
  const midi = encodeMidi({
    bpm: 120,
    tracks: [{ notes: [{ pitch: 60, start: 0, duration: 1, velocity: 100 }] }],
    ticksPerBeat: 480
  });

  it('contains note-on (0x90) for pitch 60', () => {
    let found = false;
    for (let i = 22; i < midi.length - 2; i++) {
      if (midi[i] === 0x90 && midi[i + 1] === 60 && midi[i + 2] === 100) {
        found = true;
        break;
      }
    }
    assert.ok(found, 'note-on event for C4 velocity 100 should be present');
  });

  it('contains note-off (0x80) for pitch 60', () => {
    let found = false;
    for (let i = 22; i < midi.length - 2; i++) {
      if (midi[i] === 0x80 && midi[i + 1] === 60) {
        found = true;
        break;
      }
    }
    assert.ok(found, 'note-off event for C4 should be present');
  });
});

describe('encodeMidi multiple tracks merged into single MTrk (format 0)', () => {
  const midi = encodeMidi({
    bpm: 120,
    tracks: [
      { notes: [{ pitch: 60, start: 0, duration: 1, velocity: 80 }] },
      { notes: [{ pitch: 72, start: 0.5, duration: 0.5, velocity: 90 }] }
    ],
    ticksPerBeat: 480
  });

  it('only one MTrk chunk exists', () => {
    let count = 0;
    for (let i = 0; i < midi.length - 3; i++) {
      if (midi[i] === 0x4D && midi[i + 1] === 0x54 &&
          midi[i + 2] === 0x72 && midi[i + 3] === 0x6B) { // "MTrk"
        count++;
      }
    }
    assert.strictEqual(count, 1);
  });

  it('both pitches are present in the track', () => {
    let found60 = false;
    let found72 = false;
    for (let i = 22; i < midi.length - 2; i++) {
      if (midi[i] === 0x90 && midi[i + 1] === 60) found60 = true;
      if (midi[i] === 0x90 && midi[i + 1] === 72) found72 = true;
    }
    assert.ok(found60, 'pitch 60 should be present');
    assert.ok(found72, 'pitch 72 should be present');
  });
});
