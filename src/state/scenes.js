// Scene and arrangement data structures for sequencing multiple patterns.
// Pure functions — all operations return new objects, never mutate inputs.

let sceneCounter = 0;

/**
 * Resets the internal scene ID counter. Exists solely for test determinism
 * — production code should never need this.
 */
export function resetSceneCounter() {
  sceneCounter = 0;
}

function nextSceneId() {
  sceneCounter++;
  return `scene-${sceneCounter}`;
}

function createDefaultTrack() {
  return { steps: Array(16).fill(false), pulses: 0, rotation: 0, velocity: 80 };
}

/**
 * Creates a scene with sensible defaults for a blank 4-track pattern.
 * Options let callers override any field without needing the full shape.
 */
export function createScene(options = {}) {
  const {
    id = nextSceneId(),
    name,
    bpm = 120,
    swing = 0,
    trackCount = 4,
  } = options;

  const sceneName = name !== undefined ? name : id;

  return {
    id,
    name: sceneName,
    bpm,
    swing,
    tracks: Array.from({ length: trackCount }, createDefaultTrack),
    muteMask: Array(trackCount).fill(false),
  };
}

/**
 * Creates an arrangement — an ordered list of scenes with playback state.
 * Starts with a single blank scene so there is always something to edit.
 */
export function createArrangement(options = {}) {
  const {
    id = 'arr-1',
    name = 'Untitled',
    loop = true,
  } = options;

  return {
    id,
    name,
    scenes: [createScene()],
    currentIndex: 0,
    loop,
  };
}

/**
 * Appends a scene to the arrangement. If no scene is provided, a fresh
 * default is created. Returns a new arrangement — the original is untouched.
 */
export function addScene(arrangement, scene) {
  const newScene = scene !== undefined ? scene : createScene();
  return {
    ...arrangement,
    scenes: [...arrangement.scenes, newScene],
  };
}

/**
 * Removes a scene by index. Refuses to remove the last remaining scene
 * so the arrangement always has at least one. Clamps currentIndex when
 * the removal would leave it out of bounds.
 */
export function removeScene(arrangement, index) {
  if (arrangement.scenes.length <= 1) return arrangement;
  if (index < 0 || index >= arrangement.scenes.length) return arrangement;

  const scenes = arrangement.scenes.filter((_, i) => i !== index);
  const currentIndex = Math.min(arrangement.currentIndex, scenes.length - 1);

  return { ...arrangement, scenes, currentIndex };
}

/**
 * Sets the active scene index, clamping to the valid range so the UI
 * never references a non-existent scene.
 */
export function setCurrentScene(arrangement, index) {
  const clamped = Math.max(0, Math.min(index, arrangement.scenes.length - 1));
  return { ...arrangement, currentIndex: clamped };
}

/**
 * Deep-copies a scene at the given index and inserts it immediately after.
 * The duplicate gets a fresh ID so it can be independently modified.
 */
export function duplicateScene(arrangement, index) {
  if (index < 0 || index >= arrangement.scenes.length) return arrangement;

  const original = arrangement.scenes[index];
  const copy = {
    ...original,
    id: nextSceneId(),
    name: original.name + ' copy',
    tracks: original.tracks.map(t => ({
      ...t,
      steps: [...t.steps],
    })),
    muteMask: [...original.muteMask],
  };

  const scenes = [
    ...arrangement.scenes.slice(0, index + 1),
    copy,
    ...arrangement.scenes.slice(index + 1),
  ];

  return { ...arrangement, scenes };
}
