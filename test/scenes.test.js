import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  createScene, createArrangement,
  addScene, removeScene, setCurrentScene, duplicateScene,
  resetSceneCounter
} from '../src/state/scenes.js';

// Reset counter before each test so IDs are deterministic.
beforeEach(() => {
  resetSceneCounter();
});

describe('createScene defaults', () => {
  it('has bpm=120, swing=0', () => {
    const s = createScene();
    assert.strictEqual(s.bpm, 120);
    assert.strictEqual(s.swing, 0);
  });

  it('has 4 tracks with 16 steps each', () => {
    const s = createScene();
    assert.strictEqual(s.tracks.length, 4);
    for (const track of s.tracks) {
      assert.strictEqual(track.steps.length, 16);
      assert.ok(track.steps.every(v => v === false));
    }
  });

  it('tracks have correct default properties', () => {
    const s = createScene();
    for (const track of s.tracks) {
      assert.strictEqual(track.pulses, 0);
      assert.strictEqual(track.rotation, 0);
      assert.strictEqual(track.velocity, 80);
    }
  });

  it('muteMask is all false matching track count', () => {
    const s = createScene();
    assert.strictEqual(s.muteMask.length, 4);
    assert.ok(s.muteMask.every(v => v === false));
  });

  it('generates incrementing IDs', () => {
    const s1 = createScene();
    const s2 = createScene();
    assert.strictEqual(s1.id, 'scene-1');
    assert.strictEqual(s2.id, 'scene-2');
  });
});

describe('createScene with options', () => {
  it('overrides bpm and swing', () => {
    const s = createScene({ bpm: 140, swing: 30 });
    assert.strictEqual(s.bpm, 140);
    assert.strictEqual(s.swing, 30);
  });

  it('overrides trackCount', () => {
    const s = createScene({ trackCount: 8 });
    assert.strictEqual(s.tracks.length, 8);
    assert.strictEqual(s.muteMask.length, 8);
  });

  it('overrides id and name', () => {
    const s = createScene({ id: 'my-scene', name: 'Verse' });
    assert.strictEqual(s.id, 'my-scene');
    assert.strictEqual(s.name, 'Verse');
  });
});

describe('createArrangement', () => {
  it('starts with 1 scene', () => {
    const arr = createArrangement();
    assert.strictEqual(arr.scenes.length, 1);
  });

  it('defaults to loop=true', () => {
    const arr = createArrangement();
    assert.strictEqual(arr.loop, true);
  });

  it('defaults name to Untitled', () => {
    const arr = createArrangement();
    assert.strictEqual(arr.name, 'Untitled');
  });

  it('currentIndex starts at 0', () => {
    const arr = createArrangement();
    assert.strictEqual(arr.currentIndex, 0);
  });

  it('respects options', () => {
    const arr = createArrangement({ id: 'arr-custom', name: 'My Song', loop: false });
    assert.strictEqual(arr.id, 'arr-custom');
    assert.strictEqual(arr.name, 'My Song');
    assert.strictEqual(arr.loop, false);
  });
});

describe('addScene', () => {
  it('increases scene count by 1', () => {
    const arr = createArrangement();
    const updated = addScene(arr);
    assert.strictEqual(updated.scenes.length, 2);
  });

  it('does not mutate original', () => {
    const arr = createArrangement();
    const originalLength = arr.scenes.length;
    addScene(arr);
    assert.strictEqual(arr.scenes.length, originalLength);
  });

  it('appends a provided scene', () => {
    const arr = createArrangement();
    const custom = createScene({ bpm: 90, name: 'Breakdown' });
    const updated = addScene(arr, custom);
    assert.strictEqual(updated.scenes[1].name, 'Breakdown');
    assert.strictEqual(updated.scenes[1].bpm, 90);
  });
});

describe('removeScene', () => {
  it('decreases scene count by 1', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    assert.strictEqual(arr.scenes.length, 2);
    const updated = removeScene(arr, 0);
    assert.strictEqual(updated.scenes.length, 1);
  });

  it('no-op when only 1 scene remains', () => {
    const arr = createArrangement();
    const updated = removeScene(arr, 0);
    assert.strictEqual(updated.scenes.length, 1);
    assert.strictEqual(updated, arr);
  });

  it('clamps currentIndex when removal shortens array', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    arr = setCurrentScene(arr, 1);
    const updated = removeScene(arr, 1);
    assert.strictEqual(updated.currentIndex, 0);
  });

  it('does not mutate original', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    const before = arr.scenes.length;
    removeScene(arr, 0);
    assert.strictEqual(arr.scenes.length, before);
  });
});

describe('setCurrentScene', () => {
  it('sets the index', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    arr = addScene(arr);
    const updated = setCurrentScene(arr, 2);
    assert.strictEqual(updated.currentIndex, 2);
  });

  it('clamps to 0 for negative index', () => {
    const arr = createArrangement();
    const updated = setCurrentScene(arr, -5);
    assert.strictEqual(updated.currentIndex, 0);
  });

  it('clamps to last index when too large', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    const updated = setCurrentScene(arr, 99);
    assert.strictEqual(updated.currentIndex, 1);
  });
});

describe('duplicateScene', () => {
  it('inserts copy after the original', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    const updated = duplicateScene(arr, 0);
    assert.strictEqual(updated.scenes.length, 3);
  });

  it('new scene has different id', () => {
    const arr = createArrangement();
    const updated = duplicateScene(arr, 0);
    assert.notStrictEqual(updated.scenes[0].id, updated.scenes[1].id);
  });

  it('new scene has same data (tracks, bpm, swing)', () => {
    const arr = createArrangement();
    const updated = duplicateScene(arr, 0);
    const orig = updated.scenes[0];
    const copy = updated.scenes[1];
    assert.strictEqual(copy.bpm, orig.bpm);
    assert.strictEqual(copy.swing, orig.swing);
    assert.deepStrictEqual(copy.tracks, orig.tracks);
    assert.deepStrictEqual(copy.muteMask, orig.muteMask);
  });

  it('duplicate is a deep copy (tracks are independent)', () => {
    const arr = createArrangement();
    const updated = duplicateScene(arr, 0);
    updated.scenes[1].tracks[0].steps[0] = true;
    assert.strictEqual(updated.scenes[0].tracks[0].steps[0], false);
  });

  it('does not mutate original arrangement', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    const before = arr.scenes.length;
    duplicateScene(arr, 0);
    assert.strictEqual(arr.scenes.length, before);
  });
});

describe('non-mutation guarantees', () => {
  it('addScene returns a new object', () => {
    const arr = createArrangement();
    const updated = addScene(arr);
    assert.notStrictEqual(arr, updated);
  });

  it('removeScene returns a new object when it removes', () => {
    let arr = createArrangement();
    arr = addScene(arr);
    const updated = removeScene(arr, 0);
    assert.notStrictEqual(arr, updated);
  });

  it('setCurrentScene returns a new object', () => {
    const arr = createArrangement();
    const updated = setCurrentScene(arr, 0);
    assert.notStrictEqual(arr, updated);
  });

  it('duplicateScene returns a new object', () => {
    const arr = createArrangement();
    const updated = duplicateScene(arr, 0);
    assert.notStrictEqual(arr, updated);
  });
});
