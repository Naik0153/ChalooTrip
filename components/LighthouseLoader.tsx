'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LighthouseLoaderProps {
  label?: string;
  sublabel?: string;
  minimal?: boolean;
}

export const LighthouseLoader: React.FC<LighthouseLoaderProps> = ({
  label = 'Loading travel experiences...',
  sublabel = 'Scanning real-time passes, live radar & amenities',
  minimal = false,
}) => {
  if (minimal) {
    return (
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
          <div className="w-6 h-6 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
          <div className="absolute w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        </div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/90 border border-slate-200/80 p-8 sm:p-12 text-center shadow-xl shadow-slate-900/[0.04]">
      {/* 21st.dev Ambient Glow Gradients */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-red-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-tl from-blue-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Center Lighthouse Beacon Animation */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer sweeping radar/beam circle */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/30 animate-[spin_8s_linear_infinite]" />
          
          {/* Middle expanding pulse wave (Lighthouse flash) */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-red-500/10 to-amber-500/10 animate-ping duration-1000" />
          
          {/* Modern conic beam simulation */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-[spin_3s_linear_infinite]" />

          {/* Central Core Icon with Glowing Halo */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-xl shadow-red-500/30 flex items-center justify-center text-white">
            <svg
              className="w-7 h-7 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Lighthouse Silhouette SVG */}
              <path d="M6 22h12" />
              <path d="M8 22l2-13h4l2 13" />
              <path d="M9 9h6" />
              <path d="M10 5h4" />
              <path d="M11 2h2" />
              <path d="M9 5l1-3h4l1 3" />
              <circle cx="12" cy="7" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Text Details with High-Contrast Typography */}
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h4 className="text-base font-black text-slate-900 flex items-center justify-center space-x-2">
            <span>{label}</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {sublabel}
          </p>
        </div>

        {/* 21st.dev Style Skeleton Indicator Bars */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full w-2/3 animate-pulse" />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>Lighthouse Scanner</span>
            <span>Chaloo Safe Trip</span>
          </div>
        </div>
      </div>
    </div>
  );
};
