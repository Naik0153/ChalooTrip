'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { MapView } from '@/components/MapView';
import { AlternativesCard } from '@/components/AlternativesCard';
import { FacilitiesCard } from '@/components/FacilitiesCard';
import { YatraBookingTabs } from '@/components/YatraBookingTabs';
import { BudgetCalculator } from '@/components/BudgetCalculator';
import { WindyWeatherWidget } from '@/components/WindyWeatherWidget';
import { EmergencyModal } from '@/components/EmergencyModal';
import { BookingModal } from '@/components/BookingModal';
import { TicketVoucher } from '@/components/TicketVoucher';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { LighthouseLoader } from '@/components/LighthouseLoader';
import { 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  Compass 
} from 'lucide-react';
import { Destination, BookingType, BookingRecord, AlternativeSpot } from '@/lib/types';
import { POPULAR_DESTINATIONS, FALLBACK_FACILITIES, FALLBACK_ALTERNATIVES } from '@/lib/destinations-data';

export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<Destination>(POPULAR_DESTINATIONS[0]);
  const [isChangingDest, setIsChangingDest] = useState(false);
  const [activeTab, setActiveTab] = useState('monuments');

  // Emergency SOS Modal State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('monument');
  const [modalPrefill, setModalPrefill] = useState<any>({});
  const [activeVoucher, setActiveVoucher] = useState<BookingRecord | null>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = (action: () => void) => {
    try {
      const raw = localStorage.getItem('chaloo_user');
      if (!raw) {
        setPendingAction(() => action);
        setAuthMode('signup');
        setAuthModalOpen(true);
        return;
      }
      const user = JSON.parse(raw);
      if (!user.otpVerified) {
        setPendingAction(() => action);
        setAuthMode('signup');
        setAuthModalOpen(true);
        return;
      }
      action();
    } catch (e) {
      setPendingAction(() => action);
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleOpenBookingModal = (type: BookingType, prefillData: any) => {
    requireAuth(() => {
      setBookingType(type);
      setModalPrefill(prefillData);
      setIsModalOpen(true);
    });
  };

  const handleSelectAlternative = (alt: AlternativeSpot) => {
    const matched = POPULAR_DESTINATIONS.find(d => d.name.toLowerCase().includes(alt.name.toLowerCase()));
    if (matched) {
      setSelectedDestination(matched);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      const customDest: Destination = {
        id: alt.id,
        name: alt.name,
        category: 'Heritage',
        state: selectedDestination.state || 'India',
        city: selectedDestination.city,
        country: selectedDestination.country,
        coordinates: {
          lat: selectedDestination.coordinates.lat + (Math.random() - 0.5) * 0.05,
          lng: selectedDestination.coordinates.lng + (Math.random() - 0.5) * 0.05,
        },
        image: alt.image,
        description: alt.description,
        rating: alt.rating,
        reviewsCount: 12500,
        entryFee: 30,
        currency: 'INR',
        openingHours: '08:00 AM - 06:00 PM',
        typicalDurationHours: 1.5,
        baseCrowdFactor: 40,
        tags: [alt.category],
      };
      setSelectedDestination(customDest);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Facilities & Alternatives fallback resolution
  const facilities = FALLBACK_FACILITIES[selectedDestination.id] || FALLBACK_FACILITIES['default'];
  const alternatives = FALLBACK_ALTERNATIVES[selectedDestination.id] || FALLBACK_ALTERNATIVES['default'];

  // Best sample slots for booking console
  const sampleBestSlots = [
    { slot: '06:30 AM - 08:30 AM', score: 10, crowdLevel: 'Low' as const, savingsLabel: 'Morning Express', reason: 'Clear entry gates and fresh morning atmosphere.' },
    { slot: '12:30 PM - 02:00 PM', score: 25, crowdLevel: 'Moderate' as const, savingsLabel: 'Mid-Day Slot', reason: 'Convenient afternoon access window.' },
    { slot: '05:00 PM - 06:30 PM', score: 20, crowdLevel: 'Moderate' as const, savingsLabel: 'Sunset Views', reason: 'Pleasant evening temperatures.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Streamlined Navbar */}
      <Navbar 
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setAuthModalOpen(true);
        }}
      />

      {/* Hero Section: Clean & Professional with Dark Mode Support */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="relative max-w-5xl mx-auto space-y-6 z-30">
          
          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-semibold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Smart Travel Reservations & Live Traveler Safety</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Discover India. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">Travel Safely.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Explore India&apos;s sacred shrines, heritage monuments, beaches, and mountain passes. Fast-track digital passes, live Windy weather radar, trip budget calculator, and 24x7 Emergency SOS.
            </p>
          </div>

          {/* Unified Destination Search Pill */}
          <div className="pt-2 pb-1">
            <SearchBar
              selectedDestination={selectedDestination}
              onSelectDestination={dest => {
                setIsChangingDest(true);
                setTimeout(() => {
                  setSelectedDestination(dest);
                  setIsChangingDest(false);
                }, 450);
              }}
            />
          </div>

          {/* Quick Context & Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white shadow-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Viewing: <strong>{selectedDestination.name}</strong>, {selectedDestination.state}</span>
              <span className="text-amber-500 ml-1">★ {selectedDestination.rating}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEmergencyOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow-sm hover:scale-105"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency SOS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('budget-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition border border-slate-200 dark:border-slate-700"
            >
              <span>Calculate Budget</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-12 w-full">
        {isChangingDest && (
          <div className="py-4 animate-in fade-in zoom-in-95 duration-200">
            <LighthouseLoader
              label={`Loading ${selectedDestination.name}...`}
              sublabel="Syncing live Windy radar, fast-track entry slots & local essential amenities"
            />
          </div>
        )}
        
        {/* Section 1: Reservation & E-Pass Hub */}
        <section id="reservation-console" className="scroll-mt-24 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Travel & Reservation Console
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">
                • Instant E-Pass & Verified Bookings
              </span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Selected: <strong className="text-slate-900 dark:text-white">{selectedDestination.name}</strong>
            </span>
          </div>

          <YatraBookingTabs
            currentDestination={selectedDestination}
            bestSlots={sampleBestSlots}
            activeTab={activeTab}
            onTabChange={tab => setActiveTab(tab)}
            onOpenBookingModal={handleOpenBookingModal}
          />
        </section>

        {/* Section 2: Interactive Trip Budget Calculator */}
        <section id="budget-calculator" className="scroll-mt-24">
          <BudgetCalculator
            currentDestination={selectedDestination}
            onSelectDestination={dest => {
              setSelectedDestination(dest);
              const consoleEl = document.getElementById('reservation-console');
              consoleEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookBudgetPlan={plan => {
              handleOpenBookingModal('monument', {
                title: `${plan.destination.name} - ${plan.tierName} Tour Package (${plan.days}D / ${Math.max(1, plan.days - 1)}N)`,
                destinationCity: `${plan.destination.name}, ${plan.destination.state}`,
                date: new Date().toISOString().split('T')[0],
                timeSlot: '08:00 AM - 05:00 PM (Full Day)',
                visitorTier: plan.tier === 'luxury' ? 'vip' : 'standard',
                unitPrice: Math.round(plan.grandTotal / Math.max(1, plan.adults)),
                totalAmount: plan.grandTotal,
                passengersOrGuests: plan.adults + plan.children,
              });
            }}
          />
        </section>

        {/* Section 3: Live Weather Radar by Windy.com */}
        <section id="windy-weather" className="scroll-mt-24">
          <WindyWeatherWidget destination={selectedDestination} />
        </section>

        {/* Section 4: Interactive Map & Nearby Facilities */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Destination Map & Explorer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                Geographic perspective, parking, restrooms, and quiet alternatives
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-7 w-full">
              <MapView
                destination={selectedDestination}
                crowdLevel="Moderate"
                crowdScore={50}
                facilities={facilities}
                alternatives={alternatives}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-5 w-full">
              <FacilitiesCard
                destinationName={selectedDestination.name}
                facilities={facilities}
              />
            </div>
          </div>

          {/* Alternative Spots */}
          <AlternativesCard
            currentDestination={selectedDestination}
            alternatives={alternatives}
            onSelectAlternative={handleSelectAlternative}
          />
        </section>
      </main>

      {/* Floating Emergency SOS Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsEmergencyOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl shadow-red-600/40 font-bold text-xs transition transform hover:scale-105 active:scale-95 border border-white/20"
          title="Emergency SOS Distress Ping"
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">Emergency SOS</span>
        </button>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        destination={selectedDestination}
      />

      {/* Booking Checkout Modal with Web3 Blockchain Payments */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingType={bookingType}
        prefillData={modalPrefill}
        onBookingSuccess={newBooking => {
          setActiveVoucher(newBooking);
        }}
      />

      {/* Ticket Voucher Modal */}
      {activeVoucher && (
        <TicketVoucher
          booking={activeVoucher}
          onClose={() => setActiveVoucher(null)}
        />
      )}

      {/* Auth Modal for Login & Signup */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={() => {
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />

      {/* Clean Footer (No Admin Links) */}
      <Footer />
    </div>
  );
}
