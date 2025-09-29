// Video/webcam handling and detection loop

import { refs } from './dom.js';
import { addLog } from './logger.js';
import { updateThreatLevel } from './threat.js';
import { detectFrame } from './detection.js';

let video = null;
let canvas = null;
let ctx = null;
let isDetecting = false;
let animationId = null;

export async function startWebcam() {
  try {
    addLog('Requesting camera access...', 'normal');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    video = refs.inputVideo;
    video.srcObject = stream;
    video.style.display = 'block';

    video.onloadedmetadata = () => {
      setupCanvas();
      refs.loadingMessage.style.display = 'none';
      refs.outputCanvas.style.display = 'block';
      refs.startBtn.disabled = false;
      refs.webcamBtn.disabled = true;

      addLog('Camera feed active', 'success');
    };

    video.play();
  } catch (error) {
    addLog(`Camera access failed: ${error.message}`, 'critical');
    console.error('Camera error:', error);
  }
}

export function setupCanvas() {
  canvas = refs.outputCanvas;
  ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
}

export function startDetection() {
  if (!video) {
    addLog('Video not ready', 'critical');
    return;
  }

  isDetecting = true;
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;

  addLog('Detection started', 'success');
  updateThreatLevel('low');

  runDetectionLoop();
}

export function stopDetection() {
  isDetecting = false;
  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  addLog('Detection stopped', 'warning');
  updateThreatLevel('low');
}

function runDetectionLoop() {
  if (!isDetecting) return;

  detectFrame(video, canvas, ctx).then(() => {
    animationId = requestAnimationFrame(runDetectionLoop);
  });
}

export function handleVideoFile(file) {
  addLog(`Loading video file: ${file.name}`, 'normal');

  video = refs.inputVideo;
  video.src = URL.createObjectURL(file);
  video.style.display = 'block';

  video.onloadedmetadata = () => {
    setupCanvas();
    refs.loadingMessage.style.display = 'none';
    refs.outputCanvas.style.display = 'block';
    refs.startBtn.disabled = false;

    addLog('Video loaded - Ready for analysis', 'success');
  };

  video.loop = true;
  video.play();
}

export function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
}

export function getVideoElement() {
  return video;
}