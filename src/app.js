// Main application orchestrator

import { refs } from './dom.js';
import { addLog, exportData } from './logger.js';
import { loadModel } from './detection.js';
import { startWebcam, startDetection, stopDetection, handleVideoFile, cleanup } from './video.js';

// Boot sequence
async function initializeSystem() {
  try {
    const success = await loadModel();
    if (success) {
      refs.webcamBtn.disabled = false;
    }
  } catch (error) {
    console.error('System initialization error:', error);
  }
}

// Event wiring
function setupEventListeners() {
  // Webcam button
  refs.webcamBtn.addEventListener('click', startWebcam);

  // Start detection button
  refs.startBtn.addEventListener('click', startDetection);

  // Stop detection button
  refs.stopBtn.addEventListener('click', stopDetection);

  // Export data button (find by matching text content since no ID in original)
  const exportBtn = Array.from(document.querySelectorAll('button')).find(
    btn => btn.textContent === 'EXPORT DATA'
  );
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }

  // File input
  refs.videoFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      handleVideoFile(file);
    }
  });

  // File input area click
  const fileInputArea = document.querySelector('.file-input');
  if (fileInputArea) {
    fileInputArea.addEventListener('click', () => {
      refs.videoFile.click();
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  // Performance monitoring
  setInterval(() => {
    const video = refs.inputVideo;
    if (video && video.srcObject) {
      // Memory usage estimation
      const memoryInfo = performance.memory;
      if (memoryInfo) {
        const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
        addLog(`Memory usage: ${usedMB}MB`, 'normal');
      }
    }
  }, 30000); // Every 30 seconds
}

// Initialize system on page load
window.addEventListener('load', () => {
  setupEventListeners();
  initializeSystem();
});