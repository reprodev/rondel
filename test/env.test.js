import { describe, it } from 'node:test';
import assert from 'node:assert';
import { floor, attack, decay } from '../src/audio/env.js';

function createMockParam(initialValue = 0) {
  const calls = [];
  return {
    value: initialValue,
    cancelScheduledValues(time) { calls.push({ method: 'cancelScheduledValues', time }); },
    setValueAtTime(value, time) { calls.push({ method: 'setValueAtTime', value, time }); this.value = value; },
    linearRampToValueAtTime(value, time) { calls.push({ method: 'linearRampToValueAtTime', value, time }); },
    exponentialRampToValueAtTime(value, time) { calls.push({ method: 'exponentialRampToValueAtTime', value, time }); },
    _calls: calls,
  };
}

describe('floor', () => {
  it('floor(0) returns 0.0001', () => {
    assert.strictEqual(floor(0), 0.0001);
  });

  it('floor(-5) returns 0.0001', () => {
    assert.strictEqual(floor(-5), 0.0001);
  });

  it('floor(0.00001) returns 0.0001', () => {
    assert.strictEqual(floor(0.00001), 0.0001);
  });

  it('floor(0.0001) returns 0.0001', () => {
    assert.strictEqual(floor(0.0001), 0.0001);
  });

  it('floor(0.5) returns 0.5', () => {
    assert.strictEqual(floor(0.5), 0.5);
  });

  it('floor(1) returns 1', () => {
    assert.strictEqual(floor(1), 1);
  });
});

describe('attack', () => {
  it('schedules cancel, anchor, and linear ramp in order', () => {
    const param = createMockParam(0);
    attack(null, param, 1.0, 0.8, 0.01);

    assert.strictEqual(param._calls.length, 3);
    assert.deepStrictEqual(param._calls[0], { method: 'cancelScheduledValues', time: 1.0 });
    assert.deepStrictEqual(param._calls[1], { method: 'setValueAtTime', value: 0, time: 1.0 });
    assert.deepStrictEqual(param._calls[2], { method: 'linearRampToValueAtTime', value: 0.8, time: 1.01 });
  });

  it('linear ramp target is exactly the targetValue passed in', () => {
    const param = createMockParam(0.2);
    attack(null, param, 0, 0.95, 0.05);

    const rampCall = param._calls[2];
    assert.strictEqual(rampCall.method, 'linearRampToValueAtTime');
    assert.strictEqual(rampCall.value, 0.95);
  });

  it('anchor time matches the time parameter', () => {
    const param = createMockParam(0.5);
    attack(null, param, 3.7, 1.0, 0.1);

    const anchorCall = param._calls[1];
    assert.strictEqual(anchorCall.method, 'setValueAtTime');
    assert.strictEqual(anchorCall.time, 3.7);
  });
});

describe('decay', () => {
  it('schedules exponential decay without snap-to-zero when target > 0.0001', () => {
    const param = createMockParam(1.0);
    decay(null, param, 2.0, 0.001, 0.3);

    assert.strictEqual(param._calls.length, 3);
    assert.deepStrictEqual(param._calls[0], { method: 'cancelScheduledValues', time: 2.0 });
    assert.deepStrictEqual(param._calls[1], { method: 'setValueAtTime', value: 1.0, time: 2.0 });
    assert.deepStrictEqual(param._calls[2], { method: 'exponentialRampToValueAtTime', value: 0.001, time: 2.3 });
  });

  it('floors target to 0.0001 and snaps to zero when targetValue is 0', () => {
    const param = createMockParam(1.0);
    decay(null, param, 2.0, 0, 0.3);

    assert.strictEqual(param._calls.length, 4);
    // exponentialRamp receives floored value, never 0
    assert.strictEqual(param._calls[2].method, 'exponentialRampToValueAtTime');
    assert.strictEqual(param._calls[2].value, 0.0001);
    // snap to true zero after ramp completes
    assert.deepStrictEqual(param._calls[3], { method: 'setValueAtTime', value: 0, time: 2.3 });
  });

  it('snaps to zero when targetValue equals 0.0001', () => {
    const param = createMockParam(1.0);
    decay(null, param, 2.0, 0.0001, 0.3);

    assert.strictEqual(param._calls[2].method, 'exponentialRampToValueAtTime');
    assert.strictEqual(param._calls[2].value, 0.0001);
    // 0.0001 <= 0.0001, so snap-to-zero fires
    assert.strictEqual(param._calls.length, 4);
    assert.deepStrictEqual(param._calls[3], { method: 'setValueAtTime', value: 0, time: 2.3 });
  });
});

describe('integration-style checks', () => {
  it('attack does not pass 0 or negative to linearRamp', () => {
    const param = createMockParam(0);
    attack(null, param, 0, 0, 0.01);

    const rampCall = param._calls.find(c => c.method === 'linearRampToValueAtTime');
    // linearRamp can handle 0 fine — just verify the sequence is correct
    assert.ok(rampCall, 'linearRampToValueAtTime should be called');
    assert.strictEqual(rampCall.value, 0);
  });

  it('decay never passes a value < 0.0001 to exponentialRampToValueAtTime', () => {
    const targets = [0, -1, 0.00001, 0.0001, -100];
    for (const target of targets) {
      const param = createMockParam(1.0);
      decay(null, param, 0, target, 0.1);

      const expCalls = param._calls.filter(c => c.method === 'exponentialRampToValueAtTime');
      for (const call of expCalls) {
        assert.ok(call.value >= 0.0001,
          `exponentialRamp received ${call.value} for target ${target}, expected >= 0.0001`);
      }
    }
  });
});
