'use client';

import React, { useState } from 'react';
import { 
  CloudRain, 
  Wind, 
  Sun, 
  ExternalLink, 
  Sparkles,
  Layers,
  Thermometer
} from 'lucide-react';
import { Destination } from '@/lib/types';

interface WindyWeatherWidgetProps {
  destination: Destination;
}

type WindyOverlay = 'wind' | 'rain' | 'temp' | 'clouds' | 'satellite';

export const WindyWeatherWidget: React.FC<WindyWeatherWidgetProps> = ({ destination }) => {
  const [activeOverlay, setActiveOverlay] = useState<WindyOverlay>('wind');
  const [zoomLevel, setZoomLevel] = useState(9);

  const { lat, lng } = destination.coordinates;

  // Build Windy Embed URL
  const windyUrl = `https://embed.windy.com/embed.html?lat=${lat}&lon=${lng}&detailLat=${lat}&detailLon=${lng}&width=100%&height=460&zoom=${zoomLevel}&level=surface&overlay=${activeOverlay}&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  const layers: { id: WindyOverlay; label: string; icon: any }[] = [
    { id: 'wind', label: 'Wind & Gusts', icon: Wind },
    { id: 'rain', label: 'Rain & Radar', icon: CloudRain },
    { id: 'temp', label: 'Temperature', icon: Thermometer },
    { id: 'clouds', label: 'Cloud Cover', icon: Sun },
    { id: 'satellite', label: 'Satellite View', icon: Layers },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-5 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Weather Radar by Windy
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium text-[10px] border border-blue-200 dark:border-blue-800">
                ECMWF Global Model
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Interactive high-resolution radar, wind currents, and precipitation for {destination.name}
            </p>
          </div>
        </div>

        {/* Windy Direct Link */}
        <a
          href={`https://www.windy.com/?${lat},${lng},10`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition self-start sm:self-auto"
        >
          <span>Open on Windy.com</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Layer Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
          {layers.map(layer => {
            const Icon = layer.icon;
            const isSelected = activeOverlay === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveOverlay(layer.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Coords:</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[11px] border border-slate-200 dark:border-slate-700">
            {lat.toFixed(3)}° N, {lng.toFixed(3)}° E
          </span>
        </div>
      </div>

      {/* Embedded Windy Iframe */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-950 aspect-[16/9] min-h-[380px]">
        <iframe
          src={windyUrl}
          title={`Windy Live Weather Radar for ${destination.name}`}
          className="w-full h-full border-0 absolute inset-0"
          loading="lazy"
        />
      </div>

      {/* Bottom Travel Weather Advisory Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            Real-time atmospheric forecast updated continuously from international satellite & radar feeds.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-normal">
          Source: Windy.com Interactive API
        </span>
      </div>
    </div>
  );
};
