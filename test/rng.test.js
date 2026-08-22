import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mulberry32, hash32, randomInt, shuffle } from '../src/gen/rng.js';

describe('mulberry32 known-answer', () => {
  it('seed 42 produces expected first 5 values', () => {
    const rng = mulberry32(42);
    const expected = [
      0.6011037519201636,
      0.44829055899754167,
      0.8524657934904099,
      0.6697340414393693,
      0.17481389874592423
    ];
    for (const val of expected) {
      assert.strictEqual(rng(), val);
    }
  });
});

describe('mulberry32 determinism', () => {
  it('same seed produces identical sequence', () => {
    const a = mulberry32(99);
    const b = mulberry32(99);
    for (let i = 0; i < 100; i++) {
      assert.strictEqual(a(), b());
    }
  });
});

describe('mulberry32 distribution', () => {
  it('10000 samples from seed 1 all in [0, 1)', () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 10000; i++) {
      const v = rng();
      assert.ok(v >= 0 && v < 1, `value ${v} out of range`);
    }
  });
});

describe('hash32 known-answer', () => {
  it('hash32("hello") = 1335831723', () => {
    assert.strictEqual(hash32('hello'), 1335831723);
  });

  it('hash32("") = 2166136261 (FNV offset basis)', () => {
    assert.strictEqual(hash32(''), 2166136261);
  });

  it('hash32("rondel") = 3292983653', () => {
    assert.strictEqual(hash32('rondel'), 3292983653);
  });
});

describe('randomInt', () => {
  it('1000 calls with (rng, 0, 7) all in [0, 7]', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 1000; i++) {
      const v = randomInt(rng, 0, 7);
      assert.ok(v >= 0 && v <= 7, `value ${v} out of range [0,7]`);
    }
  });

  it('min === max always returns that value', () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 10; i++) {
      assert.strictEqual(randomInt(rng, 5, 5), 5);
    }
  });
});

describe('shuffle', () => {
  it('same rng+seed produces same permutation', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const a = shuffle(mulberry32(7), arr);
    const b = shuffle(mulberry32(7), arr);
    assert.deepStrictEqual(a, b);
  });

  it('does not mutate the original array', () => {
    const arr = [10, 20, 30, 40];
    const copy = arr.slice();
    shuffle(mulberry32(1), arr);
    assert.deepStrictEqual(arr, copy);
  });

  it('preserves all elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(mulberry32(55), arr);
    assert.strictEqual(result.length, arr.length);
    assert.deepStrictEqual(result.slice().sort(), arr.slice().sort());
  });

  it('empty array returns empty', () => {
    assert.deepStrictEqual(shuffle(mulberry32(0), []), []);
  });
});
