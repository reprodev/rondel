import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SCALES, noteInScale, degreesInOctave, midiToFreq } from '../src/gen/scales.js';

describe('SCALES structure', () => {
  const names = [
    'major', 'minor', 'dorian', 'phrygian', 'lydian',
    'mixolydian', 'pentatonic', 'blues', 'chromatic'
  ];

  it('all 9 scales are present', () => {
    for (const name of names) {
      assert.ok(SCALES[name], `missing scale: ${name}`);
    }
  });

  it('every scale starts with 0', () => {
    for (const name of names) {
      assert.strictEqual(SCALES[name][0], 0);
    }
  });

  it('all semitone offsets in [0, 11]', () => {
    for (const name of names) {
      for (const offset of SCALES[name]) {
        assert.ok(offset >= 0 && offset <= 11, `${name}: offset ${offset} out of range`);
      }
    }
  });
});

describe('noteInScale', () => {
  it('C major degree 0 at root 60 = 60', () => {
    assert.strictEqual(noteInScale('major', 60, 0), 60);
  });

  it('C major degree 4 at root 60 = 67', () => {
    assert.strictEqual(noteInScale('major', 60, 4), 67);
  });

  it('C major degree 7 at root 60 = 72 (next octave)', () => {
    assert.strictEqual(noteInScale('major', 60, 7), 72);
  });

  it('pentatonic degree 5 at root 60 = 72 (wraps octave)', () => {
    assert.strictEqual(noteInScale('pentatonic', 60, 5), 72);
  });

  it('negative degree wraps down', () => {
    // degree -1 in major at root 60 = 60 - 12 + 11 = 59
    assert.strictEqual(noteInScale('major', 60, -1), 59);
  });
});

describe('degreesInOctave', () => {
  it('major = 7', () => {
    assert.strictEqual(degreesInOctave('major'), 7);
  });

  it('pentatonic = 5', () => {
    assert.strictEqual(degreesInOctave('pentatonic'), 5);
  });

  it('chromatic = 12', () => {
    assert.strictEqual(degreesInOctave('chromatic'), 12);
  });
});

describe('midiToFreq', () => {
  it('A4 (69) = 440', () => {
    assert.strictEqual(midiToFreq(69), 440);
  });

  it('middle C (60) ≈ 261.6256', () => {
    assert.strictEqual(midiToFreq(60), 261.6256);
  });

  it('A3 (57) = 220', () => {
    assert.strictEqual(midiToFreq(57), 220);
  });
});
