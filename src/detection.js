// Model loading and detection

import { refs, setText } from './dom.js';
import { addLog } from './logger.js';
import { getThreatForClass, updateThreatLevel } from './threat.js';
import { updateFPS, updateMetrics } from './metrics.js';

let model = null;
let detectionCount = 0;
let confidenceSum = 0;
let frameCount = 0;

export async function loadModel() {
  try {
    addLog('Initializing TensorFlow.js...', 'normal');

    // Set backend
    await tf.setBackend('webgl');
    await tf.ready();

    addLog(`Backend: ${tf.getBackend()}`, 'success');
    setText('backend', tf.getBackend().toUpperCase());

    // Load model
    addLog('Loading COCO-SSD model...', 'normal');
    model = await cocoSsd.load();

    addLog('Model loaded successfully', 'success');
    setText('modelStatus', 'READY');
    setText('modelArch', 'COCO-SSD MobileNet v2');

    addLog('System ready for deployment', 'success');
    updateThreatLevel('low');

    return true;
  } catch (error) {
    addLog(`Initialization failed: ${error.message}`, 'critical');
    console.error('Initialization error:', error);
    return false;
  }
}

export async function detectFrame(video, canvas, ctx) {
  if (!model || !video) return;

  const startTime = performance.now();

  try {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Run detection
    const predictions = await model.detect(video);

    // Calculate inference time
    const inferenceTime = Math.round(performance.now() - startTime);
    setText('inferenceTime', `${inferenceTime}ms`);

    // Process detections
    processDetections(predictions, ctx);

    // Update FPS
    updateFPS();

    // Update metrics
    updateMetrics(predictions);
  } catch (error) {
    addLog(`Detection error: ${error.message}`, 'critical');
    console.error('Detection error:', error);
  }
}

function processDetections(predictions, ctx) {
  let maxThreat = 0;
  let currentConfidenceSum = 0;

  predictions.forEach(prediction => {
    if (prediction.score > 0.3) { // Confidence threshold
      drawDetection(prediction, ctx);

      detectionCount++;
      currentConfidenceSum += prediction.score;

      // Calculate threat level
      const threatLevel = getThreatForClass(prediction.class);
      maxThreat = Math.max(maxThreat, threatLevel);

      addLog(
        `${prediction.class.toUpperCase()}: ${Math.round(prediction.score * 100)}% confidence`,
        threatLevel >= 2 ? 'warning' : 'normal'
      );
    }
  });

  // Update threat level
  if (maxThreat >= 3) updateThreatLevel('high');
  else if (maxThreat >= 2) updateThreatLevel('medium');
  else updateThreatLevel('low');

  // Update confidence average
  if (predictions.length > 0) {
    confidenceSum += currentConfidenceSum;
    frameCount++;
    const avgConfidence = Math.round((confidenceSum / frameCount) * 100);
    setText('avgConfidence', `${avgConfidence}%`);
  }

  setText('detectionCount', detectionCount);
}

export function drawDetection(prediction, ctx) {
  const [x, y, width, height] = prediction.bbox;

  // Draw bounding box
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Draw label background
  const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
  ctx.font = '14px Courier New';
  const textWidth = ctx.measureText(label).width;

  ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
  ctx.fillRect(x, y - 25, textWidth + 10, 20);

  // Draw label text
  ctx.fillStyle = '#000';
  ctx.fillText(label, x + 5, y - 10);
}