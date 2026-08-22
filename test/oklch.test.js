import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  oklchToSrgb, linearToGamma, gammaToLinear, oklchToHex, hexToOklch
} from '../src/ui/oklch.js';

function approx(actual, expected, epsilon = 0.001) {
  assert.ok(
    Math.abs(actual - expected) < epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`
  );
}

describe('oklchToSrgb', () => {
  it('black: L=0, C=0, H=0 produces [0, 0, 0]', () => {
    assert.deepStrictEqual(oklchToSrgb(0, 0, 0), [0, 0, 0]);
  });

  it('white: L=1, C=0, H=0 produces approximately [1, 1, 1]', () => {
    const [r, g, b] = oklchToSrgb(1, 0, 0);
    approx(r, 1);
    approx(g, 1);
    approx(b, 1);
  });

  it('clamps out-of-gamut values to [0, 1]', () => {
    // High chroma at mid lightness can exceed gamut
    const [r, g, b] = oklchToSrgb(0.5, 0.4, 30);
    assert.ok(r >= 0 && r <= 1, `r=${r} should be in [0,1]`);
    assert.ok(g >= 0 && g <= 1, `g=${g} should be in [0,1]`);
    assert.ok(b >= 0 && b <= 1, `b=${b} should be in [0,1]`);
  });
});

describe('linearToGamma / gammaToLinear', () => {
  it('linearToGamma(0) = 0', () => {
    assert.strictEqual(linearToGamma(0), 0);
  });

  it('linearToGamma(1) = 1', () => {
    approx(linearToGamma(1), 1);
  });

  it('gammaToLinear(linearToGamma(x)) roundtrips', () => {
    for (const x of [0, 0.1, 0.5, 0.9, 1.0]) {
      approx(gammaToLinear(linearToGamma(x)), x, 0.0001);
    }
  });

  it('linearToGamma / gammaToLinear roundtrip at 0, 0.5, 1.0', () => {
    for (const x of [0, 0.5, 1.0]) {
      const gamma = linearToGamma(x);
      const back = gammaToLinear(gamma);
      approx(back, x, 0.0001);
    }
  });
});

describe('oklchToHex', () => {
  it('black → #000000', () => {
    assert.strictEqual(oklchToHex(0, 0, 0), '#000000');
  });

  it('white → #ffffff (approximately)', () => {
    const hex = oklchToHex(1, 0, 0);
    // Allow for tiny floating point differences
    assert.ok(
      hex === '#ffffff' || hex === '#fefefe' || hex === '#fffffe',
      `expected white-ish hex, got ${hex}`
    );
  });

  it('L=0.7, C=0.15, H=150 produces a green-ish hex', () => {
    const hex = oklchToHex(0.7, 0.15, 150);
    // Parse the green channel — should be dominant
    const g = parseInt(hex.slice(3, 5), 16);
    const r = parseInt(hex.slice(1, 3), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    assert.ok(g > r, `green (${g}) should exceed red (${r})`);
    assert.ok(g > b, `green (${g}) should exceed blue (${b})`);
  });
});

describe('hexToOklch', () => {
  it('roundtrip: hexToOklch(oklchToHex(L,C,H)) ≈ original', () => {
    const L = 0.65, C = 0.1, H = 220;
    const hex = oklchToHex(L, C, H);
    const [L2, C2, H2] = hexToOklch(hex);
    approx(L2, L, 0.01);
    approx(C2, C, 0.01);
    approx(H2, H, 1);
  });

  it('#000000 → L≈0', () => {
    const [L, C, H] = hexToOklch('#000000');
    approx(L, 0, 0.001);
  });

  it('#ffffff → L≈1, C≈0', () => {
    const [L, C] = hexToOklch('#ffffff');
    approx(L, 1, 0.001);
    approx(C, 0, 0.001);
  });
});
