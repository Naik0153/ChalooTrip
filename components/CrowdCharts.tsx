'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HourlyCrowdPoint, DailyForecast } from '@/lib/types';
import { getCrowdColor, getCrowdBadgeClass } from '@/lib/utils';
import { Calendar, Clock, BarChart3, Info } from 'lucide-react';

interface CrowdChartsProps {
  hourlyData: HourlyCrowdPoint[];
  weeklyForecast: DailyForecast[];
  destinationName: string;
}

export const CrowdCharts: React.FC<CrowdChartsProps> = ({
  hourlyData,
  weeklyForecast,
  destinationName,
}) => {
  const [activeView, setActiveView] = useState<'hourly' | 'weekly'>('hourly');

  // Custom tooltip for Hourly AreaChart in Frosted Glass
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HourlyCrowdPoint;
      const color = getCrowdColor(
        data.crowdScore < 35 ? 'Low' : data.crowdScore < 65 ? 'Moderate' : data.crowdScore < 85 ? 'Busy' : 'Surge'
      );
      return (
        <div className="backdrop-blur-2xl bg-slate-900/90 text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 text-xs space-y-1.5">
          <div className="font-extrabold flex items-center justify-between space-x-3 border-b border-white/10 pb-1">
            <span>Time: {data.hour}</span>
            {data.isCurrentHour && (
              <span className="text-[10px] px-1.5 py-0.5 bg-red-500 rounded-md text-white font-black">
                NOW
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">Crowd Score: <b style={{ color }}>{data.crowdScore}/100</b></span>
          </div>
          <div className="text-slate-300">
            Est. Queue Wait: <b className="text-white">{data.waitMinutes} mins</b>
          </div>
          {data.temperature && (
            <div className="text-slate-400">
              Temp: {data.temperature}°C
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 transition-all duration-300">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4 mb-5">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-yatra-red" />
            Crowd Trends & Heatmap
          </h3>
          <p className="text-xs text-slate-500">
            Hourly flow & 7-day predictive patterns for {destinationName}
          </p>
        </div>

        {/* View Switcher in Glass Pill */}
        <div className="flex items-center space-x-1 backdrop-blur-md bg-white/50 p-1.5 rounded-2xl border border-white/60 shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setActiveView('hourly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'hourly'
                ? 'bg-white text-yatra-red shadow-md shadow-slate-900/5 border border-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hourly Flow (Today)</span>
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'weekly'
                ? 'bg-white text-yatra-red shadow-md shadow-slate-900/5 border border-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Forecast</span>
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeView === 'hourly' && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span className="font-bold text-slate-800">Visitor Density (06:00 to 22:00)</span>
            <span className="flex items-center text-slate-400 text-[11px]">
              <Info className="w-3 h-3 mr-1" /> Hover point to inspect wait time
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="crowdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea2330" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ea2330" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="crowdScore"
                  stroke="#ea2330"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#crowdGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Slot Indicators in Glass Cards */}
          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-200/60 text-center">
            <div className="p-2.5 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
              <span className="text-[10px] font-black text-emerald-800 uppercase block">Best Morning Slot</span>
              <span className="text-xs font-black text-slate-900">06:30 - 08:30 AM</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Low Crowd</span>
            </div>
            <div className="p-2.5 rounded-2xl backdrop-blur-md bg-red-500/10 border border-red-500/20 shadow-sm">
              <span className="text-[10px] font-black text-red-800 uppercase block">Peak Rush Hours</span>
              <span className="text-xs font-black text-slate-900">11:30 AM - 03:00 PM</span>
              <span className="text-[10px] text-red-600 font-bold block mt-0.5">Surge Wait Times</span>
            </div>
            <div className="p-2.5 rounded-2xl backdrop-blur-md bg-amber-500/10 border border-amber-500/20 shadow-sm">
              <span className="text-[10px] font-black text-amber-800 uppercase block">Sunset Window</span>
              <span className="text-xs font-black text-slate-900">05:00 - 06:30 PM</span>
              <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Golden Hour Glow</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly 7-Day Forecast View in Glass Cards */}
      {activeView === 'weekly' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {weeklyForecast.map((day, idx) => {
              const color = getCrowdColor(day.level);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all hover:scale-105 backdrop-blur-md ${
                    idx === 0
                      ? 'bg-red-500/15 border-red-500/30 shadow-md ring-2 ring-red-500/20'
                      : 'bg-white/60 hover:bg-white/90 border-white/60 shadow-sm'
                  }`}
                >
                  <div className="text-xs font-black text-slate-800">{day.day}</div>
                  <div className="text-[10px] text-slate-400 mb-2 font-medium">{day.date}</div>

                  <div className="my-1.5 flex flex-col items-center">
                    <span className="text-xl font-black" style={{ color }}>
                      {day.avgScore}%
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 mt-1 rounded-full font-black uppercase border ${getCrowdBadgeClass(
                        day.level
                      )}`}
                    >
                      {day.level}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 text-left space-y-1">
                    <div>
                      <span className="text-slate-400">Peak: </span>
                      <span className="font-bold text-slate-700">{day.peakHour}</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 font-bold">Best: </span>
                      <span className="font-bold text-slate-700">{day.bestWindow}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
