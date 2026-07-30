import React from 'react';
import { Cpu, ShieldAlert, BarChart3, Lock, Activity, UserCheck } from 'lucide-react';

export function AiView({ aiMetrics, biometricDefense, onResetBiometric }) {
  const stylometry = aiMetrics?.stylometry || { ttr: 0.85, capsRatio: 4.2, punctDensity: 3.1, typoFrequency: 0, wordCount: 14 };
  const sentiment = aiMetrics?.sentiment || { toxicityScore: 8, level: "NEUTRAL", profanityDetected: false, threatDetected: false };
  const anomalyScore = biometricDefense?.anomalyScore || 12;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* AI Header */}
      <div className="mono-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-white" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">ON-DEVICE AI BEHAVIORAL PROFILING ENGINE</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Sandboxed Web Worker runtime // Zero Network Permission (<span className="text-white">Network: Denied</span>)
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="mono-badge mono-badge-active">INT4 QUANTIZED ONNX</span>
          <span className="mono-badge">100% OFFLINE</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stylometry & Text Calligraphy */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">STYLOMETRY ("TEXT CALLIGRAPHY")</h3>
            <BarChart3 className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">TYPE-TOKEN RATIO (TTR):</span>
              <span className="text-white font-bold">{stylometry.ttr}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">ALL CAPS DENSITY:</span>
              <span className="text-white font-bold">{stylometry.capsRatio}%</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">PUNCTUATION DENSITY:</span>
              <span className="text-white font-bold">{stylometry.punctDensity}%</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">TYPO FREQUENCY:</span>
              <span className="text-white font-bold">{stylometry.typoFrequency} PATTERNS</span>
            </div>
          </div>
        </div>

        {/* Sentiment, Toxicity & Threat Detection */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">OFFLINE THREAT & SENTIMENT</h3>
            <Activity className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-4 font-mono text-xs">
            
            {/* Toxicity Meter */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>TOXICITY SCORE:</span>
                <span className="text-white font-bold">{sentiment.toxicityScore}%</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${sentiment.toxicityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">THREAT LEVEL:</span>
              <span className="text-white font-bold">{sentiment.level}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">PROFANITY DETECTED:</span>
              <span className="text-white font-bold">{sentiment.profanityDetected ? 'YES' : 'NO'}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">COERCION / THREAT PATTERNS:</span>
              <span className="text-white font-bold">{sentiment.threatDetected ? 'FLAGGED' : 'CLEAR'}</span>
            </div>

          </div>
        </div>

        {/* Biometric Keystroke Dynamics Defense */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">BIOMETRIC KEYSTROKE DEFENSE</h3>
            <Lock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-4 font-mono text-xs">
            <p className="text-[11px] text-zinc-400">
              Measures inter-key dwell time variance. If typing profile strays beyond threshold, app locks instantly.
            </p>

            {/* Anomaly Gauge */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>INTRUDER ANOMALY SCORE:</span>
                <span className="text-white font-bold">{anomalyScore}%</span>
              </div>
              <div className="w-full h-3.5 rounded bg-zinc-900 p-0.5 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-sm"
                  style={{ width: `${anomalyScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">LOCK THRESHOLD:</span>
              <span className="text-white font-bold">75% ANOMALY</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">TYPING STYLE MATCH:</span>
              <span className="text-white font-bold">
                {anomalyScore > 50 ? 'UNUSUAL CADENCE' : 'VERIFIED OWNER'}
              </span>
            </div>

            <button onClick={onResetBiometric} className="btn-secondary w-full justify-center text-xs">
              RESET TYPING BASELINE
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
