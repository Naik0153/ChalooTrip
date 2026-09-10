'use client';

import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { AlternativeSpot } from '@/lib/types';
import { getCrowdColor } from '@/lib/utils';

interface AlternativesCardProps {
  alternatives: AlternativeSpot[];
  mainDestinationName: string;
  onSelectAlternative?: (alt: AlternativeSpot) => void;
}

export const AlternativesCard: React.FC<AlternativesCardProps> = ({
  alternatives,
  mainDestinationName,
  onSelectAlternative,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Alternative Destinations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              Tranquil, less-crowded spots near {mainDestinationName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {alternatives.map(alt => {
          const color = getCrowdColor(
            alt.crowdScore < 35 ? 'Low' : alt.crowdScore < 65 ? 'Moderate' : 'Busy'
          );

          return (
            <div
              key={alt.id}
              className="rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-red-500/25 overflow-hidden flex flex-col group transition-all duration-200"
            >
              {/* Photo & badges */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={alt.image}
                  alt={alt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 backdrop-blur-xl bg-emerald-600/90 text-white text-[11px] font-bold rounded-full shadow-md flex items-center border border-white/20">
                  -{alt.crowdDifferencePercent}% Less Queue
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 backdrop-blur-md bg-slate-950/80 text-white text-[10px] font-medium rounded-md border border-white/20">
                  {alt.distanceKm} km away
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {alt.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500">
                      ★ {alt.rating}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {alt.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {alt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[11px] text-emerald-900 dark:text-emerald-300 font-medium mb-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2 rounded-xl leading-tight">
                    💡 <b>Tip:</b> {alt.whyVisit}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-semibold" style={{ color }}>
                        {alt.crowdScore}% Crowd
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Explore Spot</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
