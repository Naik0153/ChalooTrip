'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Hotel, 
  Ticket, 
  Utensils, 
  Car, 
  Plane, 
  Sparkles, 
  Users, 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import { Destination } from '@/lib/types';
import { POPULAR_DESTINATIONS } from '@/lib/destinations-data';
import { formatCurrency } from '@/lib/utils';

interface BudgetCalculatorProps {
  currentDestination: Destination;
  onSelectDestination?: (dest: Destination) => void;
  onBookBudgetPlan?: (planDetails: any) => void;
}

type TravelTier = 'budget' | 'comfort' | 'luxury';

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  currentDestination,
  onSelectDestination,
  onBookBudgetPlan,
}) => {
  const [selectedDestId, setSelectedDestId] = useState(currentDestination.id);
  const [days, setDays] = useState(3);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tier, setTier] = useState<TravelTier>('comfort');

  // Synchronize with external destination selection (e.g. from SearchBar)
  useEffect(() => {
    if (currentDestination?.id) {
      setSelectedDestId(currentDestination.id);
    }
  }, [currentDestination.id]);

  const destination = POPULAR_DESTINATIONS.find(d => d.id === selectedDestId) || currentDestination;

  // Base tier multipliers
  const tierConfig = {
    budget: {
      label: 'Budget',
      hotelPerNight: 1200,
      foodPerPersonPerDay: 450,
      localTransportPerDay: 400,
      intercityPerPerson: 1200,
      activitiesMultiplier: 0.8,
      desc: 'Clean guesthouses, local cafes, shared cabs, and self-guided exploration',
    },
    comfort: {
      label: 'Comfort',
      hotelPerNight: 3200,
      foodPerPersonPerDay: 950,
      localTransportPerDay: 1100,
      intercityPerPerson: 2800,
      activitiesMultiplier: 1.2,
      desc: '3-star boutique stays, AC private sedan cabs, popular dining, fast-track passes',
    },
    luxury: {
      label: 'Luxury',
      hotelPerNight: 7500,
      foodPerPersonPerDay: 2200,
      localTransportPerDay: 2600,
      intercityPerPerson: 6500,
      activitiesMultiplier: 2.0,
      desc: '5-star heritage resorts, private luxury SUV, fine dining, VIP priority darshan & private guide',
    },
  }[tier];

  const totalTravelers = Math.max(1, adults + children * 0.5);
  const roomsNeeded = Math.ceil(adults / 2);

  // Calculations
  const hotelTotal = roomsNeeded * tierConfig.hotelPerNight * Math.max(1, days - 1);
  const foodTotal = Math.round(totalTravelers * tierConfig.foodPerPersonPerDay * days);
  const activitiesTotal = Math.round((destination.entryFee || 50) * adults * tierConfig.activitiesMultiplier + (days * 350));
  const transportTotal = tierConfig.localTransportPerDay * days;
  const intercityTotal = Math.round(tierConfig.intercityPerPerson * adults);
  const miscTotal = Math.round((hotelTotal + foodTotal) * 0.08);

  const grandTotal = hotelTotal + foodTotal + activitiesTotal + transportTotal + intercityTotal + miscTotal;
  const perPersonCost = Math.round(grandTotal / Math.max(1, adults));
  const perDayCost = Math.round(grandTotal / Math.max(1, days));

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedDestId(newId);
    const matched = POPULAR_DESTINATIONS.find(d => d.id === newId);
    if (matched && onSelectDestination) {
      onSelectDestination(matched);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trip Budget Calculator</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium text-[10px] border border-emerald-200 dark:border-emerald-800">
                Live Estimates
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              Accurate expense estimates for stays, transfers, passes, and meals across India
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Destination:</label>
          <select
            value={selectedDestId}
            onChange={handleDestinationChange}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
          >
            {POPULAR_DESTINATIONS.map(d => (
              <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        {/* Days Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Trip Duration
            </span>
            <span className="text-xs font-bold text-red-600 dark:text-red-400">{days} Days / {Math.max(1, days - 1)} Nights</span>
          </div>
          <input
            type="range"
            min={1}
            max={14}
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1 Day</span>
            <span>7 Days</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Travelers Count */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
          <span className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Travelers
          </span>
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">Adults: {adults}</span>
              <span className="text-[10px] text-slate-400">12+ years</span>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs text-slate-800 dark:text-white hover:bg-slate-100"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs text-slate-800 dark:text-white hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Travel Tier */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Travel Style & Tier</span>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['budget', 'comfort', 'luxury'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition ${
                  tier === t
                    ? 'bg-red-600 text-white shadow-sm font-semibold'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1 pt-1 font-normal">{tierConfig.desc}</p>
        </div>
      </div>

      {/* Expense Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-6">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Hotel className="w-4 h-4 mx-auto text-amber-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Stay</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(hotelTotal)}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Ticket className="w-4 h-4 mx-auto text-red-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Passes</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(activitiesTotal)}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Utensils className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Food</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(foodTotal)}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Car className="w-4 h-4 mx-auto text-blue-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Cabs</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(transportTotal)}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Plane className="w-4 h-4 mx-auto text-purple-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Transit</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(intercityTotal)}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-center">
          <Sparkles className="w-4 h-4 mx-auto text-rose-600 mb-1" />
          <span className="text-[10px] text-slate-400 font-medium uppercase block">Buffer</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(miscTotal)}</span>
        </div>
      </div>

      {/* Summary Banner & CTA */}
      <div className="mt-6 p-5 rounded-2xl bg-red-500/[0.06] dark:bg-red-500/[0.12] border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-normal mb-0.5">
            <span>Estimated Total for {days} Days ({destination.name})</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">~{formatCurrency(perDayCost)} / Day</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(grandTotal)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ({formatCurrency(perPersonCost)} per adult)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Update destination in parent booking console
            if (onSelectDestination) {
              onSelectDestination(destination);
            }
            // Trigger direct booking flow or prefill
            if (onBookBudgetPlan) {
              onBookBudgetPlan({
                destination,
                days,
                adults,
                children,
                tier,
                grandTotal,
                hotelTotal,
                activitiesTotal,
                transportTotal,
                tierName: tierConfig.label,
              });
            } else {
              const el = document.getElementById('reservation-console');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-500/20 flex items-center space-x-2 transition"
        >
          <span>Book Itinerary within Budget</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
