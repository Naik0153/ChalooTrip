'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Compass,
  Sparkles
} from 'lucide-react';
import { Destination, DestinationCategory } from '@/lib/types';
import { POPULAR_DESTINATIONS, INDIAN_STATES } from '@/lib/destinations-data';

interface SearchBarProps {
  onSelectDestination: (destination: Destination) => void;
  selectedDestination: Destination;
}

const CATEGORIES: ('All' | DestinationCategory)[] = [
  'All',
  'Temples',
  'Beaches',
  'Mountains',
  'Heritage',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectDestination,
  selectedDestination,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | DestinationCategory>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Load recents from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chaloo_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 4));
    } catch (e) {}
  }, []);

  const saveRecentSearch = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem('chaloo_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('chaloo_recent_searches');
  };

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter destinations based on query, category, and state
  const filtered = POPULAR_DESTINATIONS.filter(dest => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      dest.name.toLowerCase().includes(q) ||
      dest.city.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'All' || dest.category === selectedCategory;

    const matchesState =
      selectedState === 'All States' || dest.state === selectedState;

    return matchesQuery && matchesCategory && matchesState;
  });

  // Explicit user selection (clicking dropdown card or recent search tag)
  const handleSelect = (dest: Destination, scroll = true) => {
    saveRecentSearch(dest.name);
    onSelectDestination(dest);
    setQuery(dest.name);
    setIsOpen(false);
    if (scroll && typeof window !== 'undefined') {
      const el = document.getElementById('reservation-console');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // AUTOMATIC CHANGE: When typing in search bar, automatically update destination in booking console
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = val.toLowerCase().trim();
    if (!trimmed) return;

    // 1. Check for exact or strong prefix match in popular destinations
    const matched = POPULAR_DESTINATIONS.find(d => {
      const name = d.name.toLowerCase();
      const city = d.city.toLowerCase();
      return (
        name === trimmed ||
        city === trimmed ||
        name.startsWith(trimmed) ||
        city.startsWith(trimmed) ||
        name.includes(trimmed)
      );
    });

    if (matched && matched.id !== selectedDestination.id) {
      debounceTimerRef.current = setTimeout(() => {
        // Automatically switch the booking destination without jarring auto-scroll
        onSelectDestination(matched);
      }, 350);
    } else if (!matched && trimmed.length >= 3) {
      // 2. Fallback: dynamic destination creation for any custom searched place
      debounceTimerRef.current = setTimeout(() => {
        const customDest: Destination = {
          id: trimmed.replace(/\s+/g, '-'),
          name: val.trim(),
          category: selectedCategory === 'All' ? 'Temples' : selectedCategory,
          state: selectedState === 'All States' ? 'India' : selectedState,
          city: val.trim(),
          country: 'India',
          coordinates: { lat: 28.6139, lng: 77.2090 },
          image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
          description: `Scenic spot & travel reservation for ${val.trim()}`,
          rating: 4.8,
          reviewsCount: 15400,
          entryFee: 50,
          currency: 'INR',
          openingHours: '06:00 AM - 08:00 PM',
          typicalDurationHours: 2.5,
          baseCrowdFactor: 45,
          tags: [selectedCategory === 'All' ? 'Popular' : selectedCategory],
        };
        onSelectDestination(customDest);
      }, 500);
    }
  };

  // Trigger Destination Selection on Button Click or Enter Key
  const handleTriggerSelection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (filtered.length > 0) {
      handleSelect(filtered[0], true);
      return;
    }

    if (query.trim()) {
      const customDest: Destination = {
        id: query.toLowerCase().trim().replace(/\s+/g, '-'),
        name: query.trim(),
        category: selectedCategory === 'All' ? 'Temples' : selectedCategory,
        state: selectedState === 'All States' ? 'India' : selectedState,
        city: query.trim(),
        country: 'India',
        coordinates: { lat: 28.6139, lng: 77.2090 },
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        description: `Scenic spot & travel reservation: ${query.trim()}`,
        rating: 4.8,
        reviewsCount: 28000,
        entryFee: 50,
        currency: 'INR',
        openingHours: '06:00 AM - 08:00 PM',
        typicalDurationHours: 2.5,
        baseCrowdFactor: 50,
        tags: [selectedCategory],
      };
      handleSelect(customDest, true);
      return;
    }

    handleSelect(POPULAR_DESTINATIONS[0], true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-40 transition-all duration-200">
      
      {/* Category Segmented Tabs Bar */}
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setIsOpen(true);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 backdrop-blur-md ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              {cat === 'All' ? 'All Destinations' : cat}
            </button>
          );
        })}
      </div>

      {/* Main Unified Search Pill */}
      <form
        onSubmit={handleTriggerSelection}
        className="relative backdrop-blur-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-900/[0.05] dark:shadow-black/30 border border-slate-200 dark:border-slate-700 transition-all duration-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          
          {/* State / Region Selector */}
          <div className="relative flex items-center shrink-0 px-3 py-1.5 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
            <MapPin className="w-4 h-4 text-red-500 mr-2 shrink-0" />
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setIsOpen(true);
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-white focus:outline-none cursor-pointer pr-6 appearance-none"
            >
              {INDIAN_STATES.map(state => (
                <option key={state} value={state} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {state}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Search Query Input with Instant Auto-Change */}
          <div className="flex-1 flex items-center px-3 min-w-0">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0 hidden sm:block" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              placeholder={`Search destination (e.g. "${selectedDestination.name}", "Kedarnath", "Goa", "Taj Mahal")...`}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Explore / Select Button */}
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-5 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl sm:rounded-full shadow-md shadow-red-600/20 transition-all duration-200 hover:scale-102 active:scale-98 shrink-0"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore & Book</span>
          </button>
        </div>
      </form>

      {/* Recent Searches Bar */}
      {recentSearches.length > 0 && !isOpen && (
        <div className="mt-2.5 flex items-center justify-center space-x-2 text-[11px] text-slate-600 dark:text-slate-400 overflow-x-auto scrollbar-none py-0.5">
          <span className="flex items-center font-medium shrink-0">
            <Clock className="w-3 h-3 mr-1 text-slate-400" /> Recent:
          </span>
          {recentSearches.map((term, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const found = POPULAR_DESTINATIONS.find(d =>
                  d.name.toLowerCase().includes(term.toLowerCase())
                );
                if (found) {
                  handleSelect(found, true);
                } else {
                  setQuery(term);
                  setIsOpen(true);
                }
              }}
              className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition whitespace-nowrap"
            >
              {term}
            </button>
          ))}
          <button
            type="button"
            onClick={clearRecentSearches}
            className="text-[10px] text-slate-400 hover:text-red-500 underline ml-1 shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Autocomplete Dropdown List with Dark Mode Support */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[380px] overflow-y-auto z-50 p-2 divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in-up">
          <div className="p-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex justify-between items-center">
            <span>
              Destinations ({filtered.length}) {selectedCategory !== 'All' ? `• ${selectedCategory}` : ''} {selectedState !== 'All States' ? `• ${selectedState}` : ''}
            </span>
            <span className="text-red-600 dark:text-red-400 font-medium text-[10px] flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Auto-updates booking console</span>
            </span>
          </div>

          <div className="space-y-1 pt-1.5">
            {filtered.length === 0 ? (
              <div className="p-5 text-center space-y-3">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                  No preset match for &quot;{query}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => handleTriggerSelection()}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-md flex items-center space-x-2 mx-auto hover:scale-105 transition"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View & Book Fast-Track Passes for &quot;{query}&quot;</span>
                </button>
              </div>
            ) : (
              filtered.map(dest => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelect(dest, true)}
                  className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-all duration-150 group ${
                    dest.id === selectedDestination.id
                      ? 'bg-red-50/70 dark:bg-red-950/40 border border-red-500/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition">
                        {dest.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                        {dest.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium shrink-0 hidden sm:inline">
                        {dest.state}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                      <span className="truncate">{dest.city}, {dest.state}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center group-hover:translate-x-1 transition-transform">
                      {dest.id === selectedDestination.id ? 'Active' : 'Select'} <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
