'use client';

import React, { useState } from 'react';
import { 
  Route, 
  Navigation, 
  Car, 
  Train, 
  Footprints, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import { Destination } from '@/lib/types';
import { formatWaitTime } from '@/lib/utils';

interface TravelPlannerCardProps {
  destination: Destination;
  waitTimeMinutes: number;
}

export const TravelPlannerCard: React.FC<TravelPlannerCardProps> = ({
  destination,
  waitTimeMinutes,
}) => {
  const [userOrigin, setUserOrigin] = useState('Central City Center');
  const [transportMode, setTransportMode] = useState<'cab' | 'metro' | 'walk'>('cab');
  const [isLocating, setIsLocating] = useState(false);

  const getTravelTimeMinutes = () => {
    switch (transportMode) {
      case 'cab':
        return 28;
      case 'metro':
        return 38;
      case 'walk':
        return 65;
    }
  };

  const travelMins = getTravelTimeMinutes();
  const totalMins = travelMins + waitTimeMinutes;

  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        pos => {
          setIsLocating(false);
          setUserOrigin(`My GPS Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        },
        err => {
          setIsLocating(false);
          setUserOrigin('Connaught Place, City Station');
        }
      );
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 transition-all duration-300">
      <div className="border-b border-slate-200/60 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/20 text-yatra-red flex items-center justify-center font-bold shadow-sm">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Travel Route & Wait Time Engine
            </h3>
            <p className="text-xs text-slate-500">
              Smart departure advisory to minimize both road transit & monument queue
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Origin & Transport Selectors */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Your Starting Location
              </label>
              <div className="flex items-center glass-input rounded-2xl px-3.5 py-2.5 shadow-sm">
                <MapPin className="w-4 h-4 text-yatra-red mr-2 shrink-0" />
                <input
                  type="text"
                  value={userOrigin}
                  onChange={e => setUserOrigin(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                  placeholder="Enter your hotel, airport, or address..."
                />
              </div>
            </div>
            <button
              onClick={handleUseLocation}
              disabled={isLocating}
              className="mt-5 px-3.5 py-2.5 rounded-2xl backdrop-blur-md bg-white/70 hover:bg-white text-slate-800 text-xs font-bold transition flex items-center space-x-1 shrink-0 border border-white/80 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-yatra-blue" />
              <span>{isLocating ? 'Locating...' : 'GPS'}</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Select Transport Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTransportMode('cab')}
                className={`p-2.5 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition ${
                  transportMode === 'cab'
                    ? 'bg-yatra-navy text-white shadow-md shadow-slate-900/20'
                    : 'glass-card text-slate-700'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Taxi / Cab</span>
              </button>
              <button
                onClick={() => setTransportMode('metro')}
                className={`p-2.5 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition ${
                  transportMode === 'metro'
                    ? 'bg-yatra-navy text-white shadow-md shadow-slate-900/20'
                    : 'glass-card text-slate-700'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>Metro / Bus</span>
              </button>
              <button
                onClick={() => setTransportMode('walk')}
                className={`p-2.5 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition ${
                  transportMode === 'walk'
                    ? 'bg-yatra-navy text-white shadow-md shadow-slate-900/20'
                    : 'glass-card text-slate-700'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Walking Trail</span>
              </button>
            </div>
          </div>
        </div>

        {/* Departure Recommendation Box in Glass */}
        <div className="md:col-span-5 backdrop-blur-xl bg-gradient-to-br from-red-500/10 via-white/80 to-amber-500/10 p-5 rounded-3xl border border-red-500/20 shadow-lg shadow-red-500/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-1.5 text-yatra-red text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimal Departure Advice</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              Depart by 07:45 AM
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Arrive at {destination.name} gates by 08:15 AM to stay ahead of the tour group surge.
            </p>
          </div>

          <div className="pt-3 border-t border-red-500/20 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Road Transit Duration:</span>
              <span className="font-bold text-slate-900">~{travelMins} mins</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Ticket & Security Queue:</span>
              <span className="font-bold text-slate-900">{formatWaitTime(waitTimeMinutes)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-900 pt-1.5 border-t border-dashed border-red-300 font-black">
              <span>Total Time Investment:</span>
              <span className="text-yatra-red font-black text-sm">~{totalMins} mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
