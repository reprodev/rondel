import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bjorklund, bresenham, rotate } from '../src/gen/euclid.js';

describe('bjorklund known-answer tests', () => {
  it('E(3,8) = x..x..x.', () => {
    assert.deepStrictEqual(
      bjorklund(8, 3),
      [true, false, false, true, false, false, true, false]
    );
  });

  it('E(5,8) = x.xx.xx.', () => {
    assert.deepStrictEqual(
      bjorklund(8, 5),
      [true, false, true, true, false, true, true, false]
    );
  });

  it('E(4,9) = x.x.x.x..', () => {
    assert.deepStrictEqual(
      bjorklund(9, 4),
      [true, false, true, false, true, false, true, false, false]
    );
  });

  it('E(2,5) = x.x..', () => {
    assert.deepStrictEqual(
      bjorklund(5, 2),
      [true, false, true, false, false]
    );
  });
});

describe('bjorklund/bresenham cross-check', () => {
  // Both algorithms produce maximally-even distributions. They yield the
  // same rhythm necklace — identical up to rotation.
  function isRotation(a, b) {
    if (a.length !== b.length) return false;
    const doubled = a.concat(a);
    const bStr = JSON.stringify(b);
    for (let i = 0; i < a.length; i++) {
      if (JSON.stringify(doubled.slice(i, i + a.length)) === bStr) return true;
    }
    return false;
  }

  const cases = [
    [8, 3], [8, 5], [9, 4], [5, 2], [16, 7], [12, 5], [13, 3], [16, 9]
  ];

  for (const [steps, pulses] of cases) {
    it(`E(${pulses},${steps}): same necklace (rotation-equivalent)`, () => {
      const bj = bjorklund(steps, pulses);
      const br = bresenham(steps, pulses);
      assert.strictEqual(bj.length, br.length);
      assert.strictEqual(bj.filter(Boolean).length, br.filter(Boolean).length);
      assert.ok(isRotation(bj, br), 'bresenham should be a rotation of bjorklund');
    });
  }

  it('E(3,8): both produce identical output', () => {
    // For some ratios the algorithms align exactly
    assert.deepStrictEqual(bjorklund(8, 3), bresenham(8, 3));
  });
});

describe('edge cases', () => {
  it('0 pulses returns all false', () => {
    assert.deepStrictEqual(bjorklund(8, 0), Array(8).fill(false));
  });

  it('pulses === steps returns all true', () => {
    assert.deepStrictEqual(bjorklund(5, 5), Array(5).fill(true));
  });

  it('pulses > steps clamps to all true', () => {
    assert.deepStrictEqual(bjorklund(3, 10), Array(3).fill(true));
  });

  it('steps === 0 returns empty array', () => {
    assert.deepStrictEqual(bjorklund(0, 5), []);
  });

  it('bresenham handles same edge cases', () => {
    assert.deepStrictEqual(bresenham(8, 0), Array(8).fill(false));
    assert.deepStrictEqual(bresenham(5, 5), Array(5).fill(true));
    assert.deepStrictEqual(bresenham(3, 10), Array(3).fill(true));
    assert.deepStrictEqual(bresenham(0, 5), []);
  });
});

describe('rotate', () => {
  const pattern = [true, false, false, true, false, false, true, false];

  it('rotate by 0 returns same pattern', () => {
    assert.deepStrictEqual(rotate(pattern, 0), pattern);
  });

  it('rotate by pattern.length returns same pattern', () => {
    assert.deepStrictEqual(rotate(pattern, pattern.length), pattern);
  });

  it('rotate by 1 shifts left by one position', () => {
    assert.deepStrictEqual(
      rotate(pattern, 1),
      [false, false, true, false, false, true, false, true]
    );
  });

  it('negative n wraps correctly', () => {
    // rotate by -1 should equal rotate by (length - 1)
    assert.deepStrictEqual(
      rotate(pattern, -1),
      rotate(pattern, pattern.length - 1)
    );
  });

  it('empty array returns empty', () => {
    assert.deepStrictEqual(rotate([], 3), []);
  });
});

describe('structural properties', () => {
  const cases = [
    [8, 3], [8, 5], [9, 4], [5, 2], [16, 7], [7, 0], [4, 4], [3, 10]
  ];

  for (const [steps, pulses] of cases) {
    it(`E(${pulses},${steps}): output length equals steps`, () => {
      assert.strictEqual(bjorklund(steps, pulses).length, steps);
      assert.strictEqual(bresenham(steps, pulses).length, steps);
    });

    it(`E(${pulses},${steps}): pulse count equals min(pulses, steps)`, () => {
      const expected = Math.min(pulses, steps);
      const countB = bjorklund(steps, pulses).filter(Boolean).length;
      const countR = bresenham(steps, pulses).filter(Boolean).length;
      assert.strictEqual(countB, expected);
      assert.strictEqual(countR, expected);
    });
  }
});
