import { BookingRecord, BookingType } from './types';
import { generateBookingRef } from './utils';

const STORAGE_KEY = 'chaloo_trip_bookings_v2';

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'b-init-1',
    type: 'monument',
    bookingRef: 'CT-MONU7821',
    title: 'Taj Mahal VIP Fast-Track Entry Pass',
    destinationCity: 'Agra, India',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday (completed trip)
    timeSlot: '06:30 AM - 08:30 AM (Early Bird - 70% Less Crowd)',
    passengersOrGuests: 2,
    visitorNames: ['Rahul Sharma', 'Priya Sharma'],
    totalAmount: 100,
    currency: 'INR',
    crowdLevelAtBooking: 'Low',
    status: 'Completed',
    tripCompleted: true,
    userRating: 5,
    userReview: 'Incredible early morning access! Zero queue with the Chaloo QR ticket.',
    ratedAt: new Date(Date.now() - 40000000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    meta: {
      email: 'rahul.sharma@example.com',
      gate: 'East Gate Security Line A',
      guideIncluded: true,
      audioGuide: 'English & Hindi',
    }
  },
  {
    id: 'b-init-2',
    type: 'flight',
    bookingRef: 'CT-AIR3390',
    title: 'IndiGo 6E-2041 (DEL -> AGR)',
    destinationCity: 'New Delhi to Agra',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '05:40 AM - 06:35 AM',
    passengersOrGuests: 2,
    visitorNames: ['Rahul Sharma', 'Priya Sharma'],
    totalAmount: 4850,
    currency: 'INR',
    crowdLevelAtBooking: 'Moderate',
    status: 'Confirmed',
    tripCompleted: false,
    createdAt: new Date().toISOString(),
    meta: {
      email: 'rahul.sharma@example.com',
      terminal: 'T3 - Delhi IGI Airport',
      seat: '14A, 14B',
      baggage: '15 Kg Check-in included',
    }
  },
  {
    id: 'b-init-3',
    type: 'monument',
    bookingRef: 'CT-KEDAR4491',
    title: 'Kedarnath Temple Fast-Track Darshan Pass',
    destinationCity: 'Kedarnath, Uttarakhand',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    timeSlot: '06:30 AM - 08:30 AM',
    passengersOrGuests: 4,
    visitorNames: ['Amit Verma', 'Sunita Verma', 'Aarav Verma', 'Ananya Verma'],
    totalAmount: 200,
    currency: 'INR',
    crowdLevelAtBooking: 'Moderate',
    status: 'Confirmed',
    tripCompleted: false,
    createdAt: new Date().toISOString(),
    meta: {
      email: 'amit.verma@outlook.com',
      gate: 'Mandakini River North Gate',
      tier: 'family',
    }
  }
];

export function getStoredBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading bookings from localStorage:', err);
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: Omit<BookingRecord, 'id' | 'bookingRef' | 'createdAt' | 'status'>): BookingRecord {
  const current = getStoredBookings();
  const newRecord: BookingRecord = {
    ...booking,
    id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookingRef: `CT-${booking.type.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Confirmed',
    tripCompleted: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
  return newRecord;
}

export function cancelBooking(id: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => (b.id === id ? { ...b, status: 'Cancelled' as const } : b));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to cancel in localStorage:', e);
    }
  }
  return updated;
}

export function reactivateBooking(id: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => (b.id === id ? { ...b, status: 'Confirmed' as const } : b));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
}

export function completeTrip(id: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => (b.id === id ? { ...b, status: 'Completed' as const, tripCompleted: true } : b));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
}

export function rateBooking(id: string, rating: number, review: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => {
    if (b.id === id) {
      return {
        ...b,
        userRating: rating,
        userReview: review,
        ratedAt: new Date().toISOString(),
        tripCompleted: true,
        status: 'Completed' as const,
      };
    }
    return b;
  });
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
}
