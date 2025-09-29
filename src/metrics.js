// Performance metrics tracking

import { refs, setText } from './dom.js';
import { getThreatForClass } from './threat.js';

let lastTime = performance.now();

export function updateFPS() {
  const currentTime = performance.now();
  const fps = Math.round(1000 / (currentTime - lastTime));
  setText('fps', fps);
  lastTime = currentTime;
}

export function updateMetrics(predictions) {
  // Update accuracy chart
  const accuracy = predictions.length > 0 ?
    Math.round(predictions.reduce((sum, p) => sum + p.score, 0) / predictions.length * 100) : 0;
  setText('currentAccuracy', `${accuracy}%`);
  updateChart('accuracyChart', accuracy);

  // Update processing load
  const load = Math.min(100, Math.round(predictions.length * 10 + Math.random() * 20));
  setText('gpuUsage', `${load}%`);
  updateChart('loadChart', load);

  // Update threat analysis
  const riskScore = predictions.reduce((max, p) =>
    Math.max(max, getThreatForClass(p.class)), 0);
  setText('riskScore', riskScore);
  updateChart('threatChart', riskScore * 25);
}

export function updateChart(chartId, value) {
  const chart = refs[chartId];
  const bar = document.createElement('div');
  bar.className = 'metric-bar';
  bar.style.height = `${Math.min(100, value)}%`;
  bar.style.left = `${chart.children.length * 12}px`;

  chart.appendChild(bar);

  // Keep only last 10 bars
  if (chart.children.length > 10) {
    chart.removeChild(chart.firstChild);
    // Reposition remaining bars
    Array.from(chart.children).forEach((child, index) => {
      child.style.left = `${index * 12}px`;
    });
  }
}