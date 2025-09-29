// Threat assessment

import { refs } from './dom.js';
import { addLog } from './logger.js';

export const THREAT_MAP = {
  'person': 2,
  'car': 1,
  'truck': 2,
  'bus': 2,
  'motorcycle': 2,
  'bicycle': 1,
  'airplane': 3,
  'train': 2,
  'boat': 2,
  'traffic light': 0,
  'stop sign': 0,
  'bench': 0,
  'backpack': 1,
  'handbag': 1,
  'suitcase': 2,
  'umbrella': 0,
  'bottle': 1,
  'wine glass': 1,
  'knife': 3,
  'scissors': 2,
  'laptop': 1,
  'mouse': 0,
  'remote': 0,
  'keyboard': 0,
  'cell phone': 1
};

export function getThreatForClass(className) {
  return THREAT_MAP[className] || 0;
}

export function updateThreatLevel(level) {
  const threatElement = refs.threatLevel;
  threatElement.className = `threat-level threat-${level}`;
  threatElement.textContent = `THREAT LEVEL: ${level.toUpperCase()}`;

  if (level === 'high') {
    addLog('HIGH THREAT DETECTED - Initiating protocols', 'critical');
  }
}