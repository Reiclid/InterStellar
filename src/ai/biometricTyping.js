/**
 * BIOMETRIC BEHAVIORAL DEFENSE ENGINE
 * Tracks keystroke dynamics (inter-key latency intervals & flight times).
 * Calculates anomaly score. If typing style strays beyond threshold (e.g. device stolen),
 * triggers automated security lock & master credentials demand.
 */

export class BiometricTypingDefense {
  constructor() {
    this.keyEvents = [];
    this.baselineIntervals = []; // User's trained timing profile (ms)
    this.isTrained = false;
    this.anomalyScore = 0; // 0 (Normal) to 100 (Intruder)
    this.threshold = 75;    // Lock threshold
  }

  recordKeyDown() {
    const now = performance.now();
    if (this.keyEvents.length > 0) {
      const prevTime = this.keyEvents[this.keyEvents.length - 1];
      const interval = now - prevTime;
      
      // Filter extreme pauses (> 3s)
      if (interval < 3000) {
        if (!this.isTrained) {
          this.baselineIntervals.push(interval);
          if (this.baselineIntervals.length >= 25) {
            this.isTrained = true;
          }
        } else {
          this._evaluateInterval(interval);
        }
      }
    }
    this.keyEvents.push(now);
    if (this.keyEvents.length > 50) this.keyEvents.shift();
  }

  _evaluateInterval(interval) {
    if (this.baselineIntervals.length === 0) return;

    // Calculate baseline mean & stddev
    const mean = this.baselineIntervals.reduce((a, b) => a + b, 0) / this.baselineIntervals.length;
    const variance = this.baselineIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.baselineIntervals.length;
    const stdDev = Math.sqrt(variance) || 20;

    // Z-score deviation
    const zScore = Math.abs(interval - mean) / stdDev;

    // Update rolling anomaly score (exponential decay + spike)
    if (zScore > 2.5) {
      this.anomalyScore = Math.min(100, this.anomalyScore + 18);
    } else {
      this.anomalyScore = Math.max(0, this.anomalyScore - 3);
    }
  }

  resetBaseline() {
    this.baselineIntervals = [];
    this.isTrained = false;
    this.anomalyScore = 0;
  }

  isLockTriggered() {
    return this.anomalyScore >= this.threshold;
  }
}
