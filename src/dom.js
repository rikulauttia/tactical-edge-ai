// DOM utility functions and cached references

const cache = {};

export function el(id) {
  if (!cache[id]) {
    cache[id] = document.getElementById(id);
  }
  return cache[id];
}

export function setText(id, value) {
  const element = el(id);
  if (element) {
    element.textContent = value;
  }
}

// Export common DOM references
export const refs = {
  get modelStatus() { return el('modelStatus'); },
  get fps() { return el('fps'); },
  get detectionCount() { return el('detectionCount'); },
  get inferenceTime() { return el('inferenceTime'); },
  get avgConfidence() { return el('avgConfidence'); },
  get threatLevel() { return el('threatLevel'); },
  get inputVideo() { return el('inputVideo'); },
  get outputCanvas() { return el('outputCanvas'); },
  get loadingMessage() { return el('loadingMessage'); },
  get videoContainer() { return el('videoContainer'); },
  get webcamBtn() { return el('webcamBtn'); },
  get startBtn() { return el('startBtn'); },
  get stopBtn() { return el('stopBtn'); },
  get videoFile() { return el('videoFile'); },
  get logContainer() { return el('logContainer'); },
  get currentAccuracy() { return el('currentAccuracy'); },
  get gpuUsage() { return el('gpuUsage'); },
  get riskScore() { return el('riskScore'); },
  get accuracyChart() { return el('accuracyChart'); },
  get loadChart() { return el('loadChart'); },
  get threatChart() { return el('threatChart'); },
  get backend() { return el('backend'); },
  get modelArch() { return el('modelArch'); },
};