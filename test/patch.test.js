import { describe, it } from 'node:test';
import assert from 'node:assert';
import { patchDefaults, createPatch, validatePatch } from '../src/state/patch.js';

describe('createPatch', () => {
  it('default patch has bpm=120, root=60, scale=major, seed=12345', () => {
    const p = createPatch();
    assert.strictEqual(p.bpm, 120);
    assert.strictEqual(p.root, 60);
    assert.strictEqual(p.scale, 'major');
    assert.strictEqual(p.seed, 12345);
  });

  it('default patch has 5 rings, each with 16 steps and 8 pulses', () => {
    const p = createPatch();
    assert.strictEqual(p.rings.length, 5);
    for (const ring of p.rings) {
      assert.strictEqual(ring.steps, 16);
      assert.strictEqual(ring.pulses, 8);
    }
  });

  it('overrides merge correctly', () => {
    const p = createPatch({ bpm: 140 });
    assert.strictEqual(p.bpm, 140);
    assert.strictEqual(p.root, 60);
    assert.strictEqual(p.scale, 'major');
    assert.strictEqual(p.seed, 12345);
  });

  it('ring overrides merge per-ring', () => {
    const p = createPatch({ rings: [{ pulses: 4 }] });
    assert.strictEqual(p.rings[0].pulses, 4);
    assert.strictEqual(p.rings[0].steps, 16);
    assert.strictEqual(p.rings[0].voice, 'kick');
    assert.strictEqual(p.rings[1].pulses, 8);
  });

  it('returns a new object (not same reference as defaults)', () => {
    const p = createPatch();
    assert.notStrictEqual(p, patchDefaults);
    assert.notStrictEqual(p.rings, patchDefaults.rings);
  });

  it('modifying returned patch does not affect patchDefaults', () => {
    const p = createPatch();
    p.bpm = 999;
    p.rings[0].pulses = 99;
    assert.strictEqual(patchDefaults.bpm, 120);
    assert.strictEqual(patchDefaults.rings[0].pulses, 8);
  });
});

describe('validatePatch', () => {
  it('default patch validates', () => {
    assert.strictEqual(validatePatch(createPatch()), true);
  });

  describe('invalid bpm', () => {
    for (const bad of [39, 201, NaN, 'fast']) {
      it(`throws for bpm=${JSON.stringify(bad)}`, () => {
        const p = createPatch();
        p.bpm = bad;
        assert.throws(() => validatePatch(p), /bpm/i);
      });
    }
  });

  describe('invalid root', () => {
    for (const bad of [-1, 128, 60.5]) {
      it(`throws for root=${bad}`, () => {
        const p = createPatch();
        p.root = bad;
        assert.throws(() => validatePatch(p), /root/i);
      });
    }
  });

  it('invalid scale throws', () => {
    const p = createPatch();
    p.scale = 'jazz';
    assert.throws(() => validatePatch(p), /scale/i);
  });

  describe('invalid seed', () => {
    for (const bad of [-1, 1.5]) {
      it(`throws for seed=${bad}`, () => {
        const p = createPatch();
        p.seed = bad;
        assert.throws(() => validatePatch(p), /seed/i);
      });
    }
  });

  describe('invalid masterGain', () => {
    for (const bad of [-0.1, 1.1]) {
      it(`throws for masterGain=${bad}`, () => {
        const p = createPatch();
        p.masterGain = bad;
        assert.throws(() => validatePatch(p), /masterGain/i);
      });
    }
  });

  describe('invalid ring steps', () => {
    for (const bad of [0, 33]) {
      it(`throws for steps=${bad}`, () => {
        const p = createPatch();
        p.rings[0].steps = bad;
        assert.throws(() => validatePatch(p), /steps/i);
      });
    }
  });

  describe('invalid ring pulses', () => {
    it('throws for negative pulses', () => {
      const p = createPatch();
      p.rings[0].pulses = -1;
      assert.throws(() => validatePatch(p), /pulses/i);
    });

    it('throws for pulses > steps', () => {
      const p = createPatch();
      p.rings[0].pulses = 17;
      assert.throws(() => validatePatch(p), /pulses/i);
    });
  });

  describe('invalid ring rotation', () => {
    it('throws for negative rotation', () => {
      const p = createPatch();
      p.rings[0].rotation = -1;
      assert.throws(() => validatePatch(p), /rotation/i);
    });

    it('throws for rotation >= steps', () => {
      const p = createPatch();
      p.rings[0].rotation = 16;
      assert.throws(() => validatePatch(p), /rotation/i);
    });
  });

  describe('invalid ring probability', () => {
    for (const bad of [-0.1, 1.1]) {
      it(`throws for probability=${bad}`, () => {
        const p = createPatch();
        p.rings[0].probability = bad;
        assert.throws(() => validatePatch(p), /probability/i);
      });
    }
  });

  describe('invalid ring gain', () => {
    for (const bad of [-0.1, 1.1]) {
      it(`throws for gain=${bad}`, () => {
        const p = createPatch();
        p.rings[0].gain = bad;
        assert.throws(() => validatePatch(p), /gain/i);
      });
    }
  });

  describe('invalid ring sends', () => {
    it('throws for delaySend < 0', () => {
      const p = createPatch();
      p.rings[0].delaySend = -0.1;
      assert.throws(() => validatePatch(p), /delaySend/i);
    });

    it('throws for delaySend > 1', () => {
      const p = createPatch();
      p.rings[0].delaySend = 1.1;
      assert.throws(() => validatePatch(p), /delaySend/i);
    });

    it('throws for reverbSend < 0', () => {
      const p = createPatch();
      p.rings[0].reverbSend = -0.1;
      assert.throws(() => validatePatch(p), /reverbSend/i);
    });

    it('throws for reverbSend > 1', () => {
      const p = createPatch();
      p.rings[0].reverbSend = 1.1;
      assert.throws(() => validatePatch(p), /reverbSend/i);
    });
  });

  describe('wrong number of rings', () => {
    it('throws for 4 rings', () => {
      const p = createPatch();
      p.rings = p.rings.slice(0, 4);
      assert.throws(() => validatePatch(p), /rings/i);
    });

    it('throws for 6 rings', () => {
      const p = createPatch();
      p.rings.push({ voice: 'kick', steps: 16, pulses: 8, rotation: 0, probability: 1, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 });
      assert.throws(() => validatePatch(p), /rings/i);
    });
  });

  describe('invalid arrangement', () => {
    it('throws for empty scenes array', () => {
      const p = createPatch();
      p.arrangement.scenes = [];
      assert.throws(() => validatePatch(p), /scenes/i);
    });

    it('throws for currentScene out of range', () => {
      const p = createPatch();
      p.arrangement.currentScene = 1;
      assert.throws(() => validatePatch(p), /currentScene/i);
    });

    it('throws for loop not boolean', () => {
      const p = createPatch();
      p.arrangement.loop = 'yes';
      assert.throws(() => validatePatch(p), /loop/i);
    });
  });
});

describe('JSON roundtrip', () => {
  it('JSON.parse(JSON.stringify(createPatch())) validates', () => {
    const p = JSON.parse(JSON.stringify(createPatch()));
    assert.strictEqual(validatePatch(p), true);
  });
});
