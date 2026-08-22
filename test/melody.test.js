import { describe, it } from 'node:test';
import assert from 'node:assert';
import { walkMelody, repeatStructure } from '../src/gen/melody.js';
import { noteInScale } from '../src/gen/scales.js';
import { mulberry32 } from '../src/gen/rng.js';

describe('walkMelody determinism', () => {
  const opts = {
    scale: 'major',
    root: 60,
    steps: 16,
    minDegree: -7,
    maxDegree: 14,
    maxInterval: 3,
  };

  it('same seed produces identical melody', () => {
    const a = walkMelody({ ...opts, rng: mulberry32(42) });
    const b = walkMelody({ ...opts, rng: mulberry32(42) });
    assert.deepStrictEqual(a, b);
  });

  it('different seeds produce different melodies', () => {
    const a = walkMelody({ ...opts, rng: mulberry32(1) });
    const b = walkMelody({ ...opts, rng: mulberry32(2) });
    // Extremely unlikely to be identical
    const same = a.every((v, i) => v === b[i]);
    assert.ok(!same, 'different seeds should produce different output');
  });
});

describe('walkMelody length', () => {
  it('returns array of requested length', () => {
    const melody = walkMelody({
      rng: mulberry32(1),
      scale: 'pentatonic',
      root: 48,
      steps: 32,
      minDegree: -5,
      maxDegree: 10,
      maxInterval: 2,
    });
    assert.strictEqual(melody.length, 32);
  });

  it('steps=0 returns empty array', () => {
    const melody = walkMelody({
      rng: mulberry32(1),
      scale: 'major',
      root: 60,
      steps: 0,
      minDegree: -7,
      maxDegree: 7,
      maxInterval: 3,
    });
    assert.deepStrictEqual(melody, []);
  });

  it('steps=1 returns array with root note', () => {
    const melody = walkMelody({
      rng: mulberry32(1),
      scale: 'major',
      root: 60,
      steps: 1,
      minDegree: -7,
      maxDegree: 7,
      maxInterval: 3,
    });
    assert.deepStrictEqual(melody, [60]);
  });
});

describe('walkMelody register bounds', () => {
  it('all notes within [minDegree, maxDegree] bounds', () => {
    const opts = {
      rng: mulberry32(77),
      scale: 'minor',
      root: 60,
      steps: 200,
      minDegree: -7,
      maxDegree: 14,
      maxInterval: 3,
    };
    const melody = walkMelody(opts);

    const minNote = noteInScale('minor', 60, -7);
    const maxNote = noteInScale('minor', 60, 14);

    for (const note of melody) {
      assert.ok(
        note >= minNote && note <= maxNote,
        `note ${note} outside register [${minNote}, ${maxNote}]`
      );
    }
  });
});

describe('walkMelody max interval constraint', () => {
  it('consecutive notes differ by at most maxInterval scale degrees', () => {
    const maxInterval = 2;
    const melody = walkMelody({
      rng: mulberry32(99),
      scale: 'major',
      root: 60,
      steps: 100,
      minDegree: -14,
      maxDegree: 14,
      maxInterval,
    });

    // The maximum MIDI jump for maxInterval=2 in major is 2 scale steps
    // which could be up to 4 semitones (e.g., whole + whole). But clamping
    // can make it smaller. We check that jumps stay within a reasonable bound.
    // maxInterval degrees in any diatonic scale spans at most maxInterval*2 semitones.
    const maxSemitones = maxInterval * 2;

    for (let i = 1; i < melody.length; i++) {
      const diff = Math.abs(melody[i] - melody[i - 1]);
      assert.ok(
        diff <= maxSemitones,
        `jump of ${diff} semitones between notes ${i - 1} and ${i} exceeds maxInterval=${maxInterval}`
      );
    }
  });
});

describe('repeatStructure', () => {
  const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  it('repeatChance=1.0: every group after first repeats', () => {
    const rng = mulberry32(1); // not used meaningfully since chance=1
    const result = repeatStructure(rng, base, 1.0);
    // Groups: [1,2,3,4], [1,2,3,4], [1,2,3,4]
    assert.deepStrictEqual(result, [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  });

  it('repeatChance=0.0: no forced repeats (original preserved)', () => {
    const rng = mulberry32(1);
    const result = repeatStructure(rng, base, 0.0);
    assert.deepStrictEqual(result, base);
  });

  it('empty melody returns empty', () => {
    assert.deepStrictEqual(repeatStructure(mulberry32(1), [], 0.5), []);
  });

  it('preserves output length', () => {
    const melody = Array.from({ length: 20 }, (_, i) => 60 + i);
    const result = repeatStructure(mulberry32(5), melody, 0.5);
    assert.strictEqual(result.length, melody.length);
  });
});
