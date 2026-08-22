import { describe, it } from 'node:test';
import assert from 'node:assert';
import { presets, getPresetByName, getPresetNames } from '../src/state/presets.js';
import { validatePatch } from '../src/state/patch.js';

describe('presets', () => {
  it('has 6 presets', () => {
    assert.strictEqual(presets.length, 6);
  });

  it('each preset has a unique name', () => {
    const names = presets.map(p => p.name);
    assert.strictEqual(new Set(names).size, names.length);
  });

  it('each preset validates as a valid patch', () => {
    for (const preset of presets) {
      assert.doesNotThrow(() => validatePatch(preset), `preset "${preset.name}" failed validation`);
    }
  });

  it('each preset has exactly 5 rings', () => {
    for (const preset of presets) {
      assert.strictEqual(preset.rings.length, 5, `preset "${preset.name}" has ${preset.rings.length} rings`);
    }
  });

  it('each ring has all required fields', () => {
    const fields = ['voice', 'steps', 'pulses', 'rotation', 'probability', 'gain', 'delaySend', 'reverbSend'];
    for (const preset of presets) {
      for (let i = 0; i < preset.rings.length; i++) {
        for (const field of fields) {
          assert.ok(field in preset.rings[i], `preset "${preset.name}" ring ${i} missing field "${field}"`);
        }
      }
    }
  });

  it('BPM values are in valid range (40-200)', () => {
    for (const preset of presets) {
      assert.ok(preset.bpm >= 40 && preset.bpm <= 200, `preset "${preset.name}" bpm ${preset.bpm} out of range`);
    }
  });

  it('pulses never exceed steps in any ring', () => {
    for (const preset of presets) {
      for (let i = 0; i < preset.rings.length; i++) {
        const ring = preset.rings[i];
        assert.ok(ring.pulses <= ring.steps, `preset "${preset.name}" ring ${i}: pulses ${ring.pulses} > steps ${ring.steps}`);
      }
    }
  });

  it('rotation never exceeds steps-1', () => {
    for (const preset of presets) {
      for (let i = 0; i < preset.rings.length; i++) {
        const ring = preset.rings[i];
        if (ring.steps > 0) {
          assert.ok(ring.rotation <= ring.steps - 1, `preset "${preset.name}" ring ${i}: rotation ${ring.rotation} >= steps ${ring.steps}`);
        }
      }
    }
  });
});

describe('getPresetByName', () => {
  it('finds Techno', () => {
    const p = getPresetByName('Techno');
    assert.ok(p);
    assert.strictEqual(p.bpm, 128);
  });

  it('case-insensitive', () => {
    assert.ok(getPresetByName('ambient'));
    assert.ok(getPresetByName('GLITCH'));
  });

  it('returns null for unknown name', () => {
    assert.strictEqual(getPresetByName('nonexistent'), null);
  });
});

describe('getPresetNames', () => {
  it('returns array of 6 strings', () => {
    const names = getPresetNames();
    assert.strictEqual(names.length, 6);
    for (const n of names) assert.strictEqual(typeof n, 'string');
  });
});
