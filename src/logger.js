// Logging and data export

import { refs, setText } from './dom.js';

export function addLog(message, type = 'normal') {
  const logContainer = refs.logContainer;
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;

  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  entry.innerHTML = `<strong>[${timestamp}]</strong> ${message}`;

  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;

  // Keep only last 500 entries
  if (logContainer.children.length > 500) {
    logContainer.removeChild(logContainer.firstChild);
  }
}

export function exportData() {
  const exportData = {
    timestamp: new Date().toISOString(),
    system: 'Tactical Edge AI v1.0',
    detectionCount: refs.detectionCount.textContent,
    averageConfidence: refs.avgConfidence.textContent,
    currentThreat: refs.threatLevel.textContent,
    performance: {
      fps: refs.fps.textContent,
      inferenceTime: refs.inferenceTime.textContent,
      accuracy: refs.currentAccuracy.textContent,
      gpuUsage: refs.gpuUsage.textContent
    },
    logs: Array.from(document.querySelectorAll('.log-entry')).map(entry => entry.textContent)
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tactical-edge-ai-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  addLog('Mission report exported successfully', 'success');
}