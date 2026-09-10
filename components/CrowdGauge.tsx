'use client';

import React from 'react';
import { 
  Users, 
  Clock, 
  Sparkles, 
  CloudSun, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { CrowdPredictionResult } from '@/lib/types';
import { getCrowdColor, getCrowdBadgeClass, formatWaitTime } from '@/lib/utils';

interface CrowdGaugeProps {
  prediction: CrowdPredictionResult;
  loading?: boolean;
}

export const CrowdGauge: React.FC<CrowdGaugeProps> = ({ prediction, loading }) => {
  const {
    currentScore,
    level,
    waitTimeMinutes,
    confidencePercent,
    weather,
    aiReasoning,
  } = prediction;

  const crowdColor = getCrowdColor(level);

  // SVG Gauge Calculations (Semi-circle arc 180 degrees)
  const radius = 78;
  const circumference = Math.PI * radius; // 180 deg
  const clampedScore = Math.min(100, Math.max(0, currentScore));
  const strokeDashoffset = circumference - (circumference * clampedScore) / 100;

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-500">
      {/* Background ambient glow matching crowd color */}
      <div
        className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: crowdColor }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: crowdColor }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/20 text-yatra-red flex items-center justify-center font-bold shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Live Crowd Meter</h3>
            <p className="text-xs text-slate-500">Real-time visitor density & queue index</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 glass-badge-green rounded-full text-xs font-bold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{confidencePercent}% AI Confidence</span>
        </div>
      </div>

      {/* Main Gauge & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Semi-Circle Gauge */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-56 h-36 flex items-center justify-center">
            <svg className="w-56 h-40 overflow-visible" viewBox="0 0 200 120">
              {/* Background Arc */}
              <path
                d="M 20 105 A 80 80 0 0 1 180 105"
                fill="none"
                stroke="rgba(226, 232, 240, 0.8)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Colored Progress Arc */}
              <path
                d="M 20 105 A 80 80 0 0 1 180 105"
                fill="none"
                stroke={crowdColor}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out drop-shadow-sm"
              />
            </svg>

            {/* Centered Score Display */}
            <div className="absolute top-14 flex flex-col items-center">
              <span
                className="text-4xl font-black tracking-tight transition-colors duration-500 drop-shadow-sm"
                style={{ color: crowdColor }}
              >
                {currentScore}
                <span className="text-xl font-bold text-slate-400">/100</span>
              </span>
              <span
                className={`mt-1 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wide border shadow-sm ${getCrowdBadgeClass(
                  level
                )}`}
              >
                {level} Crowd
              </span>
            </div>
          </div>

          <div className="flex justify-between w-52 text-[10px] font-extrabold uppercase text-slate-400 mt-1">
            <span className="text-emerald-600">0 Low</span>
            <span className="text-amber-500">50 Moderate</span>
            <span className="text-red-500">100 Surge</span>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="md:col-span-6 space-y-3">
          {/* Estimated Wait Time in Glass Card */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Estimated Queue Wait</div>
                <div className="text-base font-black text-slate-900">
                  {formatWaitTime(waitTimeMinutes)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] px-2.5 py-1 backdrop-blur-md bg-white/70 border border-white/60 text-slate-700 rounded-xl font-bold shadow-sm">
                Security & Ticket Gates
              </span>
            </div>
          </div>

          {/* Real-time Weather Context in Glass Card */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 flex items-center justify-center font-bold">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Live Destination Weather</div>
                <div className="text-sm font-black text-slate-900">
                  {weather.temperature}°C • {weather.weatherDescription}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end text-xs font-bold text-sky-900">
              <span className="flex items-center">
                <Droplets className="w-3 h-3 mr-1 text-sky-500" />
                {weather.precipitationProbability}% Rain
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Wind: {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Banner */}
      <div className="mt-5 p-4 rounded-2xl backdrop-blur-md bg-red-500/5 border border-red-500/15 text-xs text-slate-700 leading-relaxed flex items-start space-x-3 shadow-sm">
        <Sparkles className="w-4 h-4 text-yatra-red shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-yatra-red mr-1">DeepSeek AI Analysis:</span>
          <span className="font-medium">{aiReasoning}</span>
        </div>
      </div>
    </div>
  );
};
