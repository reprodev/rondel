// Patch state — default values, construction, and validation.
// Pure ES module, no side effects, no DOM.

const VALID_SCALES = ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'pentatonic', 'blues', 'chromatic'];
const VALID_VOICES = ['kick', 'snare', 'hat', 'bass', 'poly'];

export const patchDefaults = Object.freeze({
  bpm: 120,
  root: 60,            // MIDI note C4
  scale: 'major',
  seed: 12345,
  masterGain: 0.7,
  rings: [
    { voice: 'kick',  steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 },
    { voice: 'snare', steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 },
    { voice: 'hat',   steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 },
    { voice: 'bass',  steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 },
    { voice: 'poly',  steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.2, reverbSend: 0.3 },
  ],
  arrangement: {
    scenes: [{ name: 'A', rings: null }],  // null = use top-level rings
    currentScene: 0,
    loop: true,
  },
});

/**
 * Deep-clones patchDefaults and merges any overrides on top.
 * Ring overrides are merged per-ring (not replaced entirely).
 */
export function createPatch(overrides = {}) {
  const patch = structuredClone(patchDefaults);

  if (overrides.bpm !== undefined) patch.bpm = overrides.bpm;
  if (overrides.root !== undefined) patch.root = overrides.root;
  if (overrides.scale !== undefined) patch.scale = overrides.scale;
  if (overrides.seed !== undefined) patch.seed = overrides.seed;
  if (overrides.masterGain !== undefined) patch.masterGain = overrides.masterGain;

  if (overrides.rings) {
    for (let i = 0; i < overrides.rings.length && i < patch.rings.length; i++) {
      Object.assign(patch.rings[i], overrides.rings[i]);
    }
  }

  if (overrides.arrangement) {
    Object.assign(patch.arrangement, overrides.arrangement);
  }

  return patch;
}

/**
 * Strict validation. Throws an Error with a descriptive message if any
 * field is invalid. Returns true if valid.
 */
export function validatePatch(patch) {
  // bpm
  if (typeof patch.bpm !== 'number' || Number.isNaN(patch.bpm) || patch.bpm < 40 || patch.bpm > 200) {
    throw new Error(`Invalid bpm: ${patch.bpm} (must be number 40–200)`);
  }

  // root
  if (!Number.isInteger(patch.root) || patch.root < 0 || patch.root > 127) {
    throw new Error(`Invalid root: ${patch.root} (must be integer 0–127)`);
  }

  // scale
  if (!VALID_SCALES.includes(patch.scale)) {
    throw new Error(`Invalid scale: '${patch.scale}' (must be one of ${VALID_SCALES.join(', ')})`);
  }

  // seed
  if (!Number.isInteger(patch.seed) || patch.seed < 0) {
    throw new Error(`Invalid seed: ${patch.seed} (must be integer >= 0)`);
  }

  // masterGain
  if (typeof patch.masterGain !== 'number' || patch.masterGain < 0 || patch.masterGain > 1) {
    throw new Error(`Invalid masterGain: ${patch.masterGain} (must be number 0–1)`);
  }

  // rings
  if (!Array.isArray(patch.rings) || patch.rings.length !== 5) {
    throw new Error(`Invalid rings: must be an array of exactly 5 objects (got ${patch.rings?.length})`);
  }

  for (let i = 0; i < patch.rings.length; i++) {
    const ring = patch.rings[i];
    const prefix = `rings[${i}]`;

    if (!VALID_VOICES.includes(ring.voice)) {
      throw new Error(`${prefix}.voice invalid: '${ring.voice}' (must be one of ${VALID_VOICES.join(', ')})`);
    }
    if (!Number.isInteger(ring.steps) || ring.steps < 1 || ring.steps > 32) {
      throw new Error(`${prefix}.steps invalid: ${ring.steps} (must be integer 1–32)`);
    }
    if (!Number.isInteger(ring.pulses) || ring.pulses < 0 || ring.pulses > ring.steps) {
      throw new Error(`${prefix}.pulses invalid: ${ring.pulses} (must be integer 0–${ring.steps})`);
    }
    if (!Number.isInteger(ring.rotation) || ring.rotation < 0 || ring.rotation > ring.steps - 1) {
      throw new Error(`${prefix}.rotation invalid: ${ring.rotation} (must be integer 0–${ring.steps - 1})`);
    }
    if (typeof ring.probability !== 'number' || ring.probability < 0 || ring.probability > 1) {
      throw new Error(`${prefix}.probability invalid: ${ring.probability} (must be number 0–1)`);
    }
    if (typeof ring.gain !== 'number' || ring.gain < 0 || ring.gain > 1) {
      throw new Error(`${prefix}.gain invalid: ${ring.gain} (must be number 0–1)`);
    }
    if (typeof ring.delaySend !== 'number' || ring.delaySend < 0 || ring.delaySend > 1) {
      throw new Error(`${prefix}.delaySend invalid: ${ring.delaySend} (must be number 0–1)`);
    }
    if (typeof ring.reverbSend !== 'number' || ring.reverbSend < 0 || ring.reverbSend > 1) {
      throw new Error(`${prefix}.reverbSend invalid: ${ring.reverbSend} (must be number 0–1)`);
    }
  }

  // arrangement
  if (typeof patch.arrangement !== 'object' || patch.arrangement === null) {
    throw new Error('Invalid arrangement: must be an object');
  }

  const { scenes, currentScene, loop } = patch.arrangement;

  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error('Invalid arrangement.scenes: must be a non-empty array');
  }
  if (!Number.isInteger(currentScene) || currentScene < 0 || currentScene > scenes.length - 1) {
    throw new Error(`Invalid arrangement.currentScene: ${currentScene} (must be integer 0–${scenes.length - 1})`);
  }
  if (typeof loop !== 'boolean') {
    throw new Error(`Invalid arrangement.loop: ${loop} (must be boolean)`);
  }

  return true;
}
