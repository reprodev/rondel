// Clock worker — heartbeat timer for lookahead scheduling.
// Runs in a dedicated Worker so setInterval isn't throttled by the browser's
// background-tab policies (the Worker's own timer stays at full rate, but
// we voluntarily slow down when hidden to save battery).

let intervalId = null;
let tickInterval = 25;
let lookahead = 0.1;

function startTicking() {
  if (intervalId !== null) clearInterval(intervalId);
  intervalId = setInterval(() => {
    self.postMessage({ type: 'tick', time: performance.now() });
  }, tickInterval);
}

function stopTicking() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

self.onmessage = (e) => {
  const { command, hidden } = e.data;

  switch (command) {
    case 'start':
      startTicking();
      break;

    case 'stop':
      stopTicking();
      break;

    case 'visibility':
      if (hidden) {
        tickInterval = 100;
        lookahead = 0.75;
      } else {
        tickInterval = 25;
        lookahead = 0.1;
      }
      // Restart with new interval if currently running.
      if (intervalId !== null) startTicking();
      self.postMessage({ type: 'config', tickInterval, lookahead });
      break;

    case 'getConfig':
      self.postMessage({ type: 'config', tickInterval, lookahead });
      break;
  }
};
