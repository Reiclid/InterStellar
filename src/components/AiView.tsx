import React from 'react';
import { Cpu, Lock, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { AiMetrics } from '../types/ai';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface AiViewProps {
  aiMetrics: AiMetrics;
  biometricDefense: { anomalyScore: number };
  onResetBiometric: () => void;
}

export const AiView: React.FC<AiViewProps> = ({ aiMetrics, biometricDefense, onResetBiometric }) => {
  const stylometry = aiMetrics?.stylometry || {
    ttr: 0.85,
    capsRatio: 4.2,
    punctDensity: 3.1,
    typoFrequency: 0,
    wordCount: 14,
    avgSentenceLen: 6
  };
  const sentiment = aiMetrics?.sentiment || {
    toxicityScore: 8,
    level: 'NEUTRAL',
    profanityDetected: false,
    threatDetected: false,
    emotionScore: 12
  };
  const anomalyScore = biometricDefense?.anomalyScore || 12;

  // 1. Stylometry Radar Chart Data
  const radarData = [
    { metric: 'Vocabulary TTR', value: Math.min(100, stylometry.ttr * 100) },
    { metric: 'CAPS Density', value: Math.min(100, stylometry.capsRatio * 10) },
    { metric: 'Punctuation %', value: Math.min(100, stylometry.punctDensity * 15) },
    { metric: 'Typo Patterns', value: Math.min(100, stylometry.typoFrequency * 25) },
    { metric: 'WPM Speed', value: Math.min(100, (aiMetrics?.wpm || 48) * 0.8) }
  ];

  // 2. Keystroke Dynamics Real-Time Line Data
  const keystrokeTimeData = [
    { key: 'K1', latencyMs: 142, zScore: 0.2 },
    { key: 'K2', latencyMs: 118, zScore: 0.1 },
    { key: 'K3', latencyMs: 195, zScore: 0.8 },
    { key: 'K4', latencyMs: 130, zScore: 0.3 },
    { key: 'K5', latencyMs: 280, zScore: 1.9 },
    { key: 'K6', latencyMs: 110, zScore: 0.2 },
    { key: 'K7', latencyMs: 155, zScore: 0.4 },
    { key: 'K8', latencyMs: 175, zScore: 0.6 }
  ];

  // 3. Threat Metrics Bar Data
  const threatBarData = [
    { name: 'Toxicity', score: sentiment.toxicityScore, color: '#ffffff' },
    { name: 'Emotion', score: sentiment.emotionScore, color: '#a1a1aa' },
    { name: 'Anomaly', score: anomalyScore, color: anomalyScore > 50 ? '#ffffff' : '#71717a' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* AI Header */}
      <div className="mono-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-white" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              ON-DEVICE AI BEHAVIORAL PROFILING & RECHARTS ANALYTICS
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Sandboxed Web Worker runtime // Zero Network Permission (<span className="text-white">Network: Denied</span>)
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="mono-badge mono-badge-active">TYPESCRIPT + RECHARTS</span>
          <span className="mono-badge">100% OFFLINE</span>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Stylometry RadarChart Card */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">STYLOMETRY RADAR PROFILE</h3>
            <BarChart3 className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="metric" stroke="#a1a1aa" tick={{ fontSize: 10, fill: '#e4e4e7' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272a" tick={false} />
                <Radar name="Stylometry" dataKey="value" stroke="#ffffff" fill="#ffffff" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-500 block">TTR VOCABULARY:</span>
              <span className="text-white font-bold">{stylometry.ttr}</span>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-500 block">ALL CAPS DENSITY:</span>
              <span className="text-white font-bold">{stylometry.capsRatio}%</span>
            </div>
          </div>
        </div>

        {/* 2. Keystroke Dynamics LineChart Card */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">KEYSTROKE LATENCY (MS)</h3>
            <Activity className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keystrokeTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="key" stroke="#71717a" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0c', borderColor: '#27272a', borderRadius: '4px', fontSize: '11px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="latencyMs" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#ffffff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2 rounded bg-zinc-950 border border-zinc-850 font-mono text-[11px] flex justify-between">
            <span className="text-zinc-400">INTRUDER ANOMALY SCORE:</span>
            <span className="text-white font-bold">{anomalyScore}%</span>
          </div>
        </div>

        {/* 3. Threat Metrics BarChart Card */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">OFFLINE THREAT BREAKDOWN</h3>
            <Lock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#71717a" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0c', borderColor: '#27272a', borderRadius: '4px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {threatBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <button onClick={onResetBiometric} className="btn-secondary w-full justify-center text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            RESET TYPING BASELINE
          </button>
        </div>

      </div>

    </div>
  );
};
