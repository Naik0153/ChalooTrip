'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getStoredBookings, 
  cancelBooking,
  rateBooking 
} from '@/lib/bookings-store';
import { BookingRecord, BookingType } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { TicketVoucher } from '@/components/TicketVoucher';
import { formatCurrency } from '@/lib/utils';
import { 
  Ticket, 
  Plane, 
  Hotel, 
  Car, 
  Compass, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  QrCode,
  Star,
  Sparkles,
  X,
  MessageSquareQuote
} from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');
  const [selectedVoucher, setSelectedVoucher] = useState<BookingRecord | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Trip Rating Modal state
  const [ratingModalBooking, setRatingModalBooking] = useState<BookingRecord | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [ratingToast, setRatingToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('chaloo_user');
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      }
    } catch (e) {}
    setBookings(getStoredBookings());
  }, []);

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? Free cancellation policy applies.')) {
      const updated = cancelBooking(id);
      setBookings(updated);
    }
  };

  const handleOpenRatingModal = (b: BookingRecord) => {
    setRatingModalBooking(b);
    setSelectedStars(b.userRating || 5);
    setReviewComment(b.userReview || '');
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalBooking) return;

    const updated = rateBooking(ratingModalBooking.id, selectedStars, reviewComment || 'Great experience with Chaloo Trip crowd radar!');
    setBookings(updated);
    setRatingToast(`Thank you! Your ${selectedStars}-star rating was saved.`);
    setRatingModalBooking(null);
    setTimeout(() => setRatingToast(null), 5000);
  };

  const filtered = filter === 'All'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getTypeIcon = (type: BookingType) => {
    switch (type) {
      case 'monument':
        return <Ticket className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'hotel':
        return <Hotel className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'cab':
        return <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'package':
        return <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Background ambient glowing spheres for glass effect */}
      <div className="fixed top-20 left-10 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-80 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Rating Toast Notification */}
        {ratingToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{ratingToast}</span>
            </div>
            <button onClick={() => setRatingToast(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-xs font-black text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Chaloo Trip Radar
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              My Bookings & Smart E-Tickets
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Manage your confirmed fast-track passes, flight boarding passes, and rate completed trips
            </p>
          </div>

          {/* Status Filter in Glass Pill */}
          <div className="flex items-center space-x-1 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner self-start sm:self-auto">
            {(['All', 'Confirmed', 'Cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                  filter === tab
                    ? 'bg-slate-900 dark:bg-red-600 text-white shadow-md shadow-slate-900/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Authentication Guard on Bookings */}
        {!currentUser ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-600 dark:text-red-400 shadow-sm">
              <Ticket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Sign In to View Your Bookings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium max-w-md mx-auto leading-relaxed">
                Your fast-track monument passes and travel tickets are protected. Please sign in to access your digital QR tickets and official spot guides.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg shadow-red-500/20 transition"
              >
                Log In Now
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 glass-card font-bold text-xs rounded-xl transition text-slate-800 dark:text-white"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
              <Ticket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">No bookings found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                You haven&apos;t reserved any fast-track tickets or travels under this filter.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-red-500/20 transition hover:scale-102 transform"
            >
              Explore Destinations & Book
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => (
              <div
                key={booking.id}
                className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl backdrop-blur-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                    {getTypeIcon(booking.type)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-black text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-lg">
                        {booking.bookingRef}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center border ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                            : booking.status === 'Completed'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-500/15 border-slate-500/30 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {booking.status === 'Confirmed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        ) : booking.status === 'Completed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1 text-slate-400" />
                        )}
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {booking.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-0.5 font-medium">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                        {booking.destinationCity}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {booking.date}
                      </span>
                      {booking.timeSlot && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {booking.timeSlot}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Show Submitted Trip Rating if available */}
                    {booking.userRating && (
                      <div className="mt-1 flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= booking.userRating! ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Your Rating: {booking.userRating}/5
                        </span>
                        {booking.userReview && (
                          <span className="text-slate-600 dark:text-slate-300 italic truncate max-w-xs">
                            — &quot;{booking.userReview}&quot;
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/10 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      {booking.passengersOrGuests} {booking.passengersOrGuests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* View QR Pass Button */}
                    <button
                      onClick={() => setSelectedVoucher(booking)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center space-x-1.5 shadow hover:scale-105 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Pass</span>
                    </button>

                    {/* Rate Your Trip Button */}
                    <button
                      onClick={() => handleOpenRatingModal(booking)}
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center space-x-1 transition"
                      title="Rate your visit and experience"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>{booking.userRating ? 'Edit Rating' : 'Rate Trip'}</span>
                    </button>

                    {/* Cancel booking if confirmed */}
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition rounded-xl hover:bg-red-50 dark:hover:bg-slate-800"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Ticket Voucher Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TicketVoucher
              booking={selectedVoucher}
              onClose={() => setSelectedVoucher(null)}
            />
          </div>
        </div>
      )}

      {/* Rate Trip Interactive Modal */}
      {ratingModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 text-center">
            <button
              onClick={() => setRatingModalBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-md mb-3">
              <Star className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Rate Your Trip: {ratingModalBooking.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              How was your visit? Your feedback helps future Chaloo Trip travelers beat the crowd.
            </p>

            <form onSubmit={handleSubmitRating} className="mt-5 space-y-4">
              {/* Interactive 5-Star Selector */}
              <div className="flex items-center justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSelectedStars(star)}
                    className="p-1.5 transform hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= selectedStars
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                {selectedStars === 5 && 'Outstanding Experience! ⭐⭐⭐⭐⭐'}
                {selectedStars === 4 && 'Very Good & Smooth Visit! ⭐⭐⭐⭐'}
                {selectedStars === 3 && 'Decent Trip ⭐⭐⭐'}
                {selectedStars === 2 && 'Crowded / Average ⭐⭐'}
                {selectedStars === 1 && 'Needs Improvement ⭐'}
              </span>

              {/* Quick Feedback Chips */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {[
                  'Zero Queue Entry',
                  'Accurate Crowd Radar',
                  'Helpful Spot Guide',
                  'Easy Parking'
                ].map(chip => (
                  <button
                    type="button"
                    key={chip}
                    onClick={() => setReviewComment(prev => prev ? `${prev}, ${chip}` : chip)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Review Comment Area */}
              <div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share a tip about lines, parking, or best photo spots..."
                  className="w-full p-3 rounded-2xl glass-input text-xs font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Traveler Rating</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
