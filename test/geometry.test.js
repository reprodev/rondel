import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  toCartesian, toPolar, hitTestArc, hitTestCircle,
  snapToStep, stepAngle, arcPath
} from '../src/ui/geometry.js';

function approx(actual, expected, epsilon = 0.001) {
  assert.ok(
    Math.abs(actual - expected) < epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`
  );
}

describe('toCartesian', () => {
  it('angle 0 (top): {x: cx, y: cy - r}', () => {
    const { x, y } = toCartesian(100, 100, 50, 0);
    approx(x, 100);
    approx(y, 50);
  });

  it('angle 90 (right): {x: cx + r, y: cy}', () => {
    const { x, y } = toCartesian(100, 100, 50, 90);
    approx(x, 150);
    approx(y, 100);
  });

  it('angle 180 (bottom): {x: cx, y: cy + r}', () => {
    const { x, y } = toCartesian(100, 100, 50, 180);
    approx(x, 100);
    approx(y, 150);
  });
});

describe('toPolar', () => {
  it('roundtrip: toCartesian then toPolar returns original values', () => {
    const cases = [0, 45, 90, 135, 180, 225, 270, 315];
    for (const angle of cases) {
      const { x, y } = toCartesian(100, 100, 50, angle);
      const polar = toPolar(100, 100, x, y);
      approx(polar.radius, 50);
      approx(polar.angle, angle);
    }
  });
});

describe('hitTestCircle', () => {
  it('point inside returns true', () => {
    assert.strictEqual(hitTestCircle(100, 100, 50, 110, 110), true);
  });

  it('point outside returns false', () => {
    assert.strictEqual(hitTestCircle(100, 100, 50, 200, 200), false);
  });

  it('point on edge returns true', () => {
    assert.strictEqual(hitTestCircle(100, 100, 50, 150, 100), true);
  });
});

describe('hitTestArc', () => {
  it('point within arc returns true', () => {
    // Arc from 0 to 90 degrees, inner 40, outer 60, centered at (100,100)
    // Point at angle ~45, radius ~50
    const { x, y } = toCartesian(100, 100, 50, 45);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 0, 90, x, y), true);
  });

  it('point outside radius returns false', () => {
    const { x, y } = toCartesian(100, 100, 70, 45);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 0, 90, x, y), false);
  });

  it('point at wrong angle returns false', () => {
    const { x, y } = toCartesian(100, 100, 50, 180);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 0, 90, x, y), false);
  });

  it('wrap-around arc (350 to 10) works correctly', () => {
    // Point at angle 5 should be inside a 350-to-10 arc
    const inside = toCartesian(100, 100, 50, 5);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 350, 10, inside.x, inside.y), true);

    // Point at angle 355 should also be inside
    const alsoInside = toCartesian(100, 100, 50, 355);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 350, 10, alsoInside.x, alsoInside.y), true);

    // Point at angle 180 should be outside
    const outside = toCartesian(100, 100, 50, 180);
    assert.strictEqual(hitTestArc(100, 100, 40, 60, 350, 10, outside.x, outside.y), false);
  });
});

describe('snapToStep', () => {
  it('8 steps: angle 0 → step 0', () => {
    assert.strictEqual(snapToStep(0, 8), 0);
  });

  it('8 steps: angle 22 → step 0 (within first step)', () => {
    assert.strictEqual(snapToStep(22, 8), 0);
  });

  it('8 steps: angle 23 → step 1 (past midpoint)', () => {
    assert.strictEqual(snapToStep(23, 8), 1);
  });

  it('16 steps: angle 180 → step 8', () => {
    assert.strictEqual(snapToStep(180, 16), 8);
  });
});

describe('stepAngle', () => {
  it('step 0 of 8 → 0', () => {
    assert.strictEqual(stepAngle(0, 8), 0);
  });

  it('step 4 of 8 → 180', () => {
    assert.strictEqual(stepAngle(4, 8), 180);
  });
});

describe('arcPath', () => {
  it('arc from 0 to 90 at r=50 centered at (100,100)', () => {
    const result = arcPath(100, 100, 50, 0, 90);
    // Start at angle 0 = top: (100, 50)
    approx(result.startX, 100);
    approx(result.startY, 50);
    // End at angle 90 = right: (150, 100)
    approx(result.endX, 150);
    approx(result.endY, 100);
    // 90 degrees < 180, so largeArc = 0
    assert.strictEqual(result.largeArc, 0);
    assert.strictEqual(result.sweepFlag, 1);
  });
});
