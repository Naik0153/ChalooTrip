'use client';

import React, { useState } from 'react';
import { 
  SquareParking, 
  Bath, 
  Utensils, 
  Cross, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { NearbyFacility } from '@/lib/types';

interface FacilitiesCardProps {
  facilities: NearbyFacility[];
  destinationName: string;
}

type FacilityFilter = 'all' | 'parking' | 'restroom' | 'food' | 'medical';

export const FacilitiesCard: React.FC<FacilitiesCardProps> = ({
  facilities,
  destinationName,
}) => {
  const [filter, setFilter] = useState<FacilityFilter>('all');

  const filtered = filter === 'all'
    ? facilities
    : facilities.filter(f => f.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'parking':
        return <SquareParking className="w-4 h-4 text-blue-600" />;
      case 'restroom':
        return <Bath className="w-4 h-4 text-indigo-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'medical':
        return <Cross className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'parking':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'restroom':
        return 'bg-indigo-500/10 border-indigo-500/20';
      case 'food':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'medical':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-600" />
            Nearby Essential Facilities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            Convenient amenities around {destinationName}
          </p>
        </div>

        {/* Filter Pills in 21st.dev Style */}
        <div className="flex items-center flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {(['all', 'parking', 'restroom', 'food', 'medical'] as FacilityFilter[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition whitespace-nowrap ${
                filter === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid in Modern 21st.dev Responsive Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filtered.map(facility => (
          <div
            key={facility.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-red-500/25 transition-all duration-200 flex items-start space-x-3 group"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shrink-0 backdrop-blur-md transition-transform duration-200 group-hover:scale-105 ${getBg(
                facility.type
              )}`}
            >
              {getIcon(facility.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {facility.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md whitespace-nowrap">
                  {facility.distanceMeters}m
                </span>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                {facility.vicinity}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] gap-2">
                <span className="flex items-center text-emerald-700 dark:text-emerald-400 font-medium truncate text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{facility.statusText}</span>
                </span>
                {facility.rating && (
                  <span className="font-bold text-amber-500 text-[11px] shrink-0">
                    ★ {facility.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
