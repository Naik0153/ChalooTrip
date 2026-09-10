'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Sparkles, 
  Compass, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';
import { Destination, CrowdLevel, AlternativeSpot } from '@/lib/types';
import { getCrowdColor, getCrowdBadgeClass } from '@/lib/utils';

interface MapViewProps {
  destination: Destination;
  crowdLevel: CrowdLevel;
  crowdScore: number;
  alternatives?: AlternativeSpot[];
}

type MapStyle = 'streets' | 'dark' | 'satellite' | 'outdoors';

const STYLE_URLS: Record<MapStyle, string> = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
};

export const MapView: React.FC<MapViewProps> = ({
  destination,
  crowdLevel,
  crowdScore,
  alternatives = [],
}) => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string>(destination.name);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const crowdColor = getCrowdColor(crowdLevel);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    // If no Mapbox token is provided in .env.local, use the rich interactive vector fallback
    if (!mapboxToken || mapboxToken.trim() === '') {
      setUseFallback(true);
      return;
    }

    let isMounted = true;

    const initMapbox = async () => {
      try {
        let mapboxgl = (window as any).mapboxgl;
        if (!mapboxgl) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js';
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
          });
          mapboxgl = (window as any).mapboxgl;
        }
        if (!mapboxgl) throw new Error('Mapbox script not found');
        mapboxgl.accessToken = mapboxToken;

        if (!mapContainerRef.current) return;

        if (mapInstance.current) {
          mapInstance.current.remove();
        }

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: STYLE_URLS[mapStyle],
          center: [destination.coordinates.lng, destination.coordinates.lat],
          zoom: 14,
          pitch: 45,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Create Custom HTML Marker with radar pulse
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div style="position: relative; cursor: pointer;">
            <div style="position: absolute; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 9999px; background-color: ${crowdColor}; opacity: 0.25;" class="marker-radar"></div>
            <div style="position: relative; width: 34px; height: 34px; border-radius: 9999px; background-color: #ffffff; border: 3px solid ${crowdColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); font-weight: bold; font-size: 11px; color: #0f172a;">
              ${crowdScore}
            </div>
          </div>
        `;

        new mapboxgl.Marker(el)
          .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 6px; font-family: sans-serif;">
                <b style="font-size: 13px; color: #0f172a;">${destination.name}</b>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${destination.city}, ${destination.country}</div>
                <div style="margin-top: 6px; display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background: ${crowdColor}22; color: ${crowdColor};">
                  ${crowdLevel} Crowd (${crowdScore}/100)
                </div>
              </div>
            `)
          )
          .addTo(map);

        mapInstance.current = map;
      } catch (err) {
        console.warn('Mapbox initialization failed, using vector fallback:', err);
        if (isMounted) setUseFallback(true);
      }
    };

    initMapbox();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [destination, mapStyle, crowdColor, crowdScore, mapboxToken]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <Compass className="w-4 h-4 mr-2 text-red-600" />
            Interactive Map & Explorer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            Real-time geolocation & surrounding points of interest for {destination.name}
          </p>
        </div>

        {/* Style switchers in Pill */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {(['streets', 'satellite', 'dark', 'outdoors'] as MapStyle[]).map(style => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition ${
                mapStyle === style
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-white/60 shadow-inner bg-slate-100">
        {!useFallback ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          /* Interactive High-Res Vector Fallback Map */
          <div
            className={`w-full h-full relative flex items-center justify-center select-none overflow-hidden transition-colors duration-500 ${
              mapStyle === 'dark'
                ? 'bg-slate-950 text-slate-100'
                : mapStyle === 'satellite'
                ? 'bg-emerald-950/90 text-slate-100'
                : 'bg-gradient-to-tr from-sky-100/60 via-slate-100 to-amber-100/60 text-slate-800'
            }`}
          >
            {/* Background Map Grid & Vector Roads */}
            <svg
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path
                d="M -50 180 C 150 120, 320 280, 600 210 S 900 320, 1200 240"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="14"
                strokeOpacity="0.4"
              />
              <path
                d="M 200 -20 L 450 450"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="8"
                strokeOpacity="0.6"
              />
              <path
                d="M -20 260 L 900 260"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeOpacity="0.6"
              />
            </svg>

            {/* Primary Center Monument Marker in Frosted Glass */}
            <div
              onClick={() => setSelectedPin(destination.name)}
              className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                top: '48%',
                left: '50%',
                transform: `scale(${fallbackZoom}) translate(-50%, -50%)`,
              }}
            >
              {/* Radar pulse */}
              <div
                className="absolute inset-0 w-16 h-16 -top-2 -left-2 rounded-full opacity-30 marker-radar pointer-events-none"
                style={{ backgroundColor: crowdColor }}
              />
              <div
                className="relative px-4 py-2 rounded-full backdrop-blur-xl bg-white/95 shadow-2xl border-2 flex items-center space-x-2.5 group-hover:scale-110 transition-transform"
                style={{ borderColor: crowdColor }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: crowdColor }}
                />
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {destination.name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">
                    Crowd Score: <b style={{ color: crowdColor }}>{crowdScore}/100</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Alternative Spot Markers */}
            {alternatives.slice(0, 3).map((alt, i) => {
              const offsets = [
                { top: '32%', left: '34%' },
                { top: '65%', left: '68%' },
                { top: '28%', left: '72%' },
              ];
              const off = offsets[i] || { top: '50%', left: '50%' };
              const altColor = getCrowdColor(
                alt.crowdScore < 35 ? 'Low' : alt.crowdScore < 65 ? 'Moderate' : 'Busy'
              );

              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedPin(alt.name)}
                  className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    top: off.top,
                    left: off.left,
                    transform: `scale(${fallbackZoom}) translate(-50%, -50%)`,
                  }}
                >
                  <div className="relative px-3 py-1.5 rounded-full backdrop-blur-lg bg-white/90 shadow-md border border-white/80 flex items-center space-x-1.5 group-hover:scale-105 transition">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: altColor }}
                    />
                    <span className="text-[10px] font-black text-slate-800 truncate max-w-[120px]">
                      {alt.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 rounded-md font-black">
                      -{alt.crowdDifferencePercent}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Controls Overlay on Fallback Map */}
            <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1 backdrop-blur-xl bg-white/80 p-1.5 rounded-2xl shadow-xl border border-white/80">
              <button
                onClick={() => setFallbackZoom(z => Math.min(1.4, z + 0.15))}
                className="p-1.5 hover:bg-white rounded-xl text-slate-700 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFallbackZoom(z => Math.max(0.75, z - 0.15))}
                className="p-1.5 hover:bg-white rounded-xl text-slate-700 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Active Pin Info Badge bottom-left */}
            <div className="absolute bottom-4 left-4 z-20 backdrop-blur-xl bg-white/90 px-4 py-2.5 rounded-2xl shadow-2xl border border-white/80 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Map Focus</div>
              <div className="font-black text-slate-900">{selectedPin}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Coords: {destination.coordinates.lat.toFixed(4)}°N, {destination.coordinates.lng.toFixed(4)}°E
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-slate-700">Crowd Legend:</span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Low (&lt;35%)
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" /> Moderate (35-65%)
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1.5" /> Busy (65-85%)
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5" /> Surge (&gt;85%)
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Tip: Click markers to inspect footfall
        </div>
      </div>
    </div>
  );
};
