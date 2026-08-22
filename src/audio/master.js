// Master output chain — glue compression, safety limiting, and aux sends.
// Pre-fader sends ensure reverb/delay tails survive a master mute.

/**
 * Build the full master bus: input fan-out, volume, dynamics, metering.
 * Voices connect to `input`; call `connect(ctx.destination)` to go live.
 *
 * @param {AudioContext} ctx
 * @returns {{
 *   input: GainNode,
 *   gain: GainNode,
 *   compressor: DynamicsCompressorNode,
 *   limiter: DynamicsCompressorNode,
 *   analyser: AnalyserNode,
 *   reverbSend: GainNode,
 *   delaySend: GainNode,
 *   connect: (destination: AudioNode) => void,
 *   disconnect: () => void
 * }}
 */
export function createMaster(ctx) {
  // Entry point — unity gain so voices sum without implicit scaling.
  const input = ctx.createGain();
  input.gain.value = 1;

  // Aux sends tap the input directly (pre-fader) so muting master
  // doesn't chop reverb/delay tails mid-ring.
  const reverbSend = ctx.createGain();
  reverbSend.gain.value = 0.15;

  const delaySend = ctx.createGain();
  delaySend.gain.value = 0.1;

  // Master volume — the single knob the user controls.
  const gain = ctx.createGain();
  gain.gain.value = 0.7;

  // Glue compressor — tames peaks without audible pumping.
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 8;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.250;

  // Hard safety limiter — prevents any sample from exceeding -1.5 dBFS.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -1.5;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.060;

  // Analyser for peak metering in the UI.
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;

  // Internal wiring: input fans out to sends + dry chain.
  input.connect(reverbSend);
  input.connect(delaySend);
  input.connect(gain);
  gain.connect(compressor);
  compressor.connect(limiter);
  limiter.connect(analyser);

  /** Wire the end of the chain to a destination (usually ctx.destination). */
  function connect(destination) {
    analyser.connect(destination);
  }

  /** Tear down all internal connections for cleanup. */
  function disconnect() {
    analyser.disconnect();
    limiter.disconnect();
    compressor.disconnect();
    gain.disconnect();
    input.disconnect();
    reverbSend.disconnect();
    delaySend.disconnect();
  }

  return {
    input,
    gain,
    compressor,
    limiter,
    analyser,
    reverbSend,
    delaySend,
    connect,
    disconnect,
  };
}
