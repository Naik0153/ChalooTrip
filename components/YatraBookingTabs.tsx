'use client';

import React, { useState } from 'react';
import { 
  Ticket, 
  Plane, 
  Hotel, 
  Car, 
  Compass, 
  Calendar, 
  Users, 
  Sparkles, 
  Check, 
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Destination, BestTimeSlot, BookingType, VisitorTier } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface YatraBookingTabsProps {
  currentDestination: Destination;
  bestSlots: BestTimeSlot[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenBookingModal: (type: BookingType, prefillData: any) => void;
}

export const YatraBookingTabs: React.FC<YatraBookingTabsProps> = ({
  currentDestination,
  bestSlots,
  activeTab,
  onTabChange,
  onOpenBookingModal,
}) => {
  // Monument booking state
  const [monumentDate, setMonumentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [monumentGuests, setMonumentGuests] = useState(2);
  const [visitorTier, setVisitorTier] = useState<VisitorTier>('family');
  const [selectedSlot, setSelectedSlot] = useState(bestSlots[0]?.slot || '06:30 AM - 08:30 AM');

  // Flights state
  const [flightFrom, setFlightFrom] = useState('DEL - New Delhi');
  const [flightTo, setFlightTo] = useState(`${currentDestination.city} Airport`);
  const [flightDate, setFlightDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [flightPassengers, setFlightPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');

  // Hotel state
  const [hotelCity, setHotelCity] = useState(currentDestination.city);
  const [checkIn, setCheckIn] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [hotelGuests, setHotelGuests] = useState(2);

  // Cab state
  const [cabPickup, setCabPickup] = useState(`${currentDestination.city} Central / Airport`);
  const [cabDrop, setCabDrop] = useState(currentDestination.name);
  const [cabType, setCabType] = useState('Sedan (Dzire / Etios)');

  const tabs = [
    { id: 'monuments', label: 'Monuments & Passes', icon: Ticket },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels & Resorts', icon: Hotel },
    { id: 'cabs', label: 'Airport & City Cabs', icon: Car },
    { id: 'packages', label: 'Holiday Bundles', icon: Compass },
  ];

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-white/[0.08] transition-all duration-300">
      
      {/* Top Segmented Tabs Navigation */}
      <div className="backdrop-blur-xl bg-slate-100/80 dark:bg-white/[0.03] p-1.5 flex space-x-1 overflow-x-auto scrollbar-none border-b border-slate-200/80 dark:border-white/[0.08]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm border border-slate-200/90 dark:border-white/10 scale-101'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        
        {/* TAB 1: MONUMENT FAST-TRACK ENTRY PASS */}
        {activeTab === 'monuments' && (
          <div className="space-y-6">
            
            {/* Spotlight Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl backdrop-blur-md bg-red-500/[0.05] dark:bg-red-500/[0.1] border border-red-500/20">
              <div className="flex items-center space-x-3.5">
                <img
                  src={currentDestination.image}
                  alt={currentDestination.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm border border-white/60 dark:border-white/10 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {currentDestination.name} Fast-Track E-Pass
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Direct QR scan at VIP gates. Bypass long queue lines.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-red-500/10">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Pass Price</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentDestination.entryFee === 0 ? 'Free Entry' : `₹${currentDestination.entryFee}`}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">per visitor</span>
              </div>
            </div>

            {/* Form Fields in Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Date */}
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Visit Date
                </label>
                <div className="flex items-center pt-0.5">
                  <Calendar className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={monumentDate}
                    onChange={e => setMonumentDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Number of Visitors */}
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Travelers / Guests
                </label>
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center text-xs font-bold text-slate-900 dark:text-white">
                    <Users className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                    <span>{monumentGuests} {monumentGuests === 1 ? 'Person' : 'People'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setMonumentGuests(Math.max(1, monumentGuests - 1))}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center hover:bg-slate-200 transition"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonumentGuests(Math.min(10, monumentGuests + 1))}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center hover:bg-slate-200 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Visitor Tier */}
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Visitor Tier
                </label>
                <select
                  value={visitorTier}
                  onChange={e => setVisitorTier(e.target.value as VisitorTier)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer pt-0.5"
                >
                  <option value="solo" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Solo Explorer</option>
                  <option value="couple" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Couple / Pair</option>
                  <option value="family" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Family Pass (Express Gate)</option>
                  <option value="group" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Group (5+ Travelers)</option>
                  <option value="senior" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Senior Citizen Priority</option>
                </select>
              </div>
            </div>

            {/* Recommended Time Window Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Crowd-Optimized Entry Window
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Recommended
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bestSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot.slot)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                      selectedSlot === slot.slot
                        ? 'border-red-500 bg-red-500/[0.08] dark:bg-red-500/[0.15] shadow-sm'
                        : 'glass-card hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-red-500" />
                        {slot.slot}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                        {slot.savingsLabel || 'Low Queue'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                      {slot.reason}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Summary Bar & Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.08]">
              <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Instant Digital QR Pass • 100% Free Cancellation before 2 hrs</span>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Amount</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(Math.max(1, monumentGuests) * (currentDestination.entryFee || 50))}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenBookingModal('monument', {
                      title: `${currentDestination.name} VIP Fast-Track Pass`,
                      destinationCity: `${currentDestination.city}, ${currentDestination.state}`,
                      date: monumentDate,
                      timeSlot: selectedSlot,
                      passengersOrGuests: monumentGuests,
                      visitorTier,
                      totalAmount: Math.max(1, monumentGuests) * (currentDestination.entryFee || 50),
                    })
                  }
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-red-600/25 transition-all duration-200 hover:scale-102 active:scale-98 flex items-center space-x-2"
                >
                  <span>Reserve Fast-Track Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLIGHTS */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Departure</label>
                <input
                  type="text"
                  value={flightFrom}
                  onChange={e => setFlightFrom(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Arrival Destination</label>
                <input
                  type="text"
                  value={flightTo}
                  onChange={e => setFlightTo(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Travel Date</label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={e => setFlightDate(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Travelers & Class</label>
                <select
                  value={flightClass}
                  onChange={e => setFlightClass(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Economy" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">1 Adult, Economy</option>
                  <option value="Premium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">2 Adults, Premium</option>
                  <option value="Business" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Business Class</option>
                </select>
              </div>
            </div>

            {/* Flight Cards Grid */}
            <div className="space-y-3">
              {[
                { airline: 'IndiGo 6E-2041', time: '06:00 AM - 07:15 AM', duration: '1h 15m', nonStop: true, price: 3450 },
                { airline: 'Air India AI-882', time: '08:30 AM - 09:50 AM', duration: '1h 20m', nonStop: true, price: 3890 },
                { airline: 'Vistara UK-923', time: '11:15 AM - 12:40 PM', duration: '1h 25m', nonStop: true, price: 4200 },
              ].map((flight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{flight.airline}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">Non-stop</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3">
                      <span>{flight.time}</span>
                      <span>•</span>
                      <span>{flight.duration}</span>
                      <span>•</span>
                      <span>{flightFrom.split(' ')[0]} ➔ {flightTo.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{formatCurrency(flight.price)}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">per traveler</span>
                    </div>
                    <button
                      onClick={() =>
                        onOpenBookingModal('flight', {
                          title: `${flight.airline} (${flightFrom} ➔ ${flightTo})`,
                          destinationCity: flightTo,
                          date: flightDate,
                          timeSlot: flight.time,
                          passengersOrGuests: flightPassengers,
                          totalAmount: flight.price * flightPassengers,
                        })
                      }
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Book Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HOTELS */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City or Landmark</label>
                <input
                  type="text"
                  value={hotelCity}
                  onChange={e => setHotelCity(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Check-in / Check-out</label>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <span>➔</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rooms & Guests</label>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">1 Room, {hotelGuests} Guests</span>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setHotelGuests(Math.max(1, hotelGuests - 1))}
                      className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 text-xs font-bold"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setHotelGuests(hotelGuests + 1)}
                      className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  name: 'The Heritage Grand Palace',
                  distance: `800m from ${currentDestination.name}`,
                  rating: 4.8,
                  price: 4999,
                  badge: 'Low Traffic Zone',
                  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
                },
                {
                  name: 'Scenic View Boutique Resort',
                  distance: `1.2 km from ${currentDestination.name}`,
                  rating: 4.6,
                  price: 3500,
                  badge: 'Moderate Area',
                  image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80',
                },
                {
                  name: 'Royal Courtyard Haveli',
                  distance: '2.5 km away',
                  rating: 4.5,
                  price: 2650,
                  badge: 'Serene Ambience',
                  image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80',
                },
              ].map((hotel, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div className="h-28 relative">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 backdrop-blur-md bg-slate-950/80 text-white text-[10px] font-bold rounded-lg">
                      ★ {hotel.rating}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 backdrop-blur-md bg-emerald-600/90 text-white text-[10px] font-bold rounded-lg shadow-sm">
                      {hotel.badge}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{hotel.name}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{hotel.distance}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
                      <div>
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{formatCurrency(hotel.price)}</span>
                        <span className="text-[10px] text-slate-400 block">/ night</span>
                      </div>

                      <button
                        onClick={() =>
                          onOpenBookingModal('hotel', {
                            title: `${hotel.name} (${hotelCity})`,
                            destinationCity: hotelCity,
                            date: `${checkIn} to ${checkOut}`,
                            passengersOrGuests: hotelGuests,
                            totalAmount: hotel.price * 2,
                          })
                        }
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                      >
                        Book Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CABS */}
        {activeTab === 'cabs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pick-up Location</label>
                <input
                  type="text"
                  value={cabPickup}
                  onChange={e => setCabPickup(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Drop Destination</label>
                <input
                  type="text"
                  value={cabDrop}
                  onChange={e => setCabDrop(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-3.5 glass-card rounded-2xl">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Vehicle Category</label>
                <select
                  value={cabType}
                  onChange={e => setCabType(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Hatchback (WagonR / Tiago)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Compact Hatchback (4 Seater)</option>
                  <option value="Sedan (Dzire / Etios)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Comfort Sedan (4 Seater)</option>
                  <option value="SUV (Innova / Ertiga)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Prime SUV (6-7 Seater)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Prime Sedan (Dzire / Etios)', eta: '3 mins away', capacity: '4 Guests + 2 Bags', price: 950 },
                { name: 'Spacious SUV (Innova Crysta)', eta: '6 mins away', capacity: '6 Guests + 4 Bags', price: 1650 },
                { name: 'Economy Hatchback', eta: '5 mins away', capacity: '4 Guests + 1 Bag', price: 750 },
              ].map((cab, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl glass-card space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{cab.name}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{cab.eta}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cab.capacity}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
                    <span className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(cab.price)}</span>
                    <button
                      onClick={() =>
                        onOpenBookingModal('cab', {
                          title: `${cab.name} Transfer`,
                          destinationCity: `${cabPickup} to ${cabDrop}`,
                          date: new Date().toISOString().split('T')[0],
                          passengersOrGuests: 2,
                          totalAmount: cab.price,
                        })
                      }
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      Book Cab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: `${currentDestination.name} VIP Fast-Track & Heritage Retreat (3D/2N)`,
                  destinations: `${currentDestination.city} • Fast-Track Monument Entry • Luxury Stay`,
                  price: 8499,
                  highlights: ['VIP Darshan / Entry Tickets', '4-Star Hotel Stay with Breakfast', 'AC Private Sedan Transfers', 'Certified English & Hindi Guide'],
                },
                {
                  title: `${currentDestination.city} Golden Triangle Explorer (2D/1N)`,
                  destinations: `${currentDestination.city} • Local Markets • Sunset Cruise`,
                  price: 5200,
                  highlights: ['Golden Hour Guided Tour', 'Crowd-Free Slots', 'Local Food Walk', 'Professional Photography Pass'],
                }
              ].map((pkg, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full">
                      All-Inclusive Package
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2">{pkg.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{pkg.destinations}</p>

                    <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {pkg.highlights.map((h, hi) => (
                        <li key={hi} className="flex items-center">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
                    <div>
                      <span className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(pkg.price)}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">per person</span>
                    </div>

                    <button
                      onClick={() =>
                        onOpenBookingModal('package', {
                          title: pkg.title,
                          destinationCity: currentDestination.city,
                          date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                          passengersOrGuests: 2,
                          totalAmount: pkg.price * 2,
                        })
                      }
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Book Tour Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
