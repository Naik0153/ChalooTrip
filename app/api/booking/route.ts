import { NextRequest, NextResponse } from 'next/server';
import { generateBookingRef } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, destinationCity, date, timeSlot, passengersOrGuests, visitorNames, totalAmount, currency, meta } = body;

    if (!title || !date || !passengersOrGuests) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const bookingRef = generateBookingRef((type || 'BK').substring(0, 3).toUpperCase());
    const booking = {
      id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingRef,
      type: type || 'monument',
      title,
      destinationCity: destinationCity || 'India',
      date,
      timeSlot: timeSlot || 'Regular Entry',
      passengersOrGuests: Number(passengersOrGuests) || 1,
      visitorNames: visitorNames || ['Guest Traveler'],
      totalAmount: Number(totalAmount) || 0,
      currency: currency || 'INR',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      meta: meta || {},
    };

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Booking failed' }, { status: 500 });
  }
}
