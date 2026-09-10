import { NextRequest, NextResponse } from 'next/server';
import { POPULAR_DESTINATIONS } from '@/lib/destinations-data';
import { Destination } from '@/lib/types';
import { fetchLiveWeather } from '@/lib/weather';
import { predictCrowdWithDeepSeek } from '@/lib/deepseek';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destinationId = searchParams.get('id') || 'kedarnath-temple';
  
  // Look up destination or build dynamic destination
  let destination = POPULAR_DESTINATIONS.find(
    d => d.id === destinationId || d.name.toLowerCase() === destinationId.toLowerCase()
  );
  
  if (!destination) {
    const name = searchParams.get('name') || destinationId.replace(/-/g, ' ');
    const lat = parseFloat(searchParams.get('lat') || '28.6139');
    const lng = parseFloat(searchParams.get('lng') || '77.2090');
    const city = searchParams.get('city') || 'India';
    const state = searchParams.get('state') || 'India';
    const category = (searchParams.get('category') as any) || 'Temples';

    destination = {
      id: destinationId,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      category,
      state,
      city,
      country: 'India',
      coordinates: { lat, lng },
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      description: `Scenic attraction and cultural landmark located in ${city}, ${state}.`,
      rating: 4.7,
      reviewsCount: 52000,
      entryFee: 50,
      currency: 'INR',
      openingHours: '06:00 AM - 08:00 PM',
      typicalDurationHours: 2.5,
      baseCrowdFactor: 75,
      tags: [category, state],
    };
  }
  
  try {
    const weather = await fetchLiveWeather(destination.coordinates.lat, destination.coordinates.lng);
    const prediction = await predictCrowdWithDeepSeek({
      destination,
      weather,
      currentTime: new Date(),
    });

    return NextResponse.json(prediction);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to predict crowd' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destinationId, customDestination } = body;

    let destination = POPULAR_DESTINATIONS.find(d => d.id === destinationId);
    if (!destination && customDestination) {
      destination = customDestination;
    }
    if (!destination) {
      destination = POPULAR_DESTINATIONS[0];
    }

    const weather = await fetchLiveWeather(destination.coordinates.lat, destination.coordinates.lng);
    const prediction = await predictCrowdWithDeepSeek({
      destination,
      weather,
      currentTime: new Date(),
    });

    return NextResponse.json(prediction);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to process prediction' }, { status: 500 });
  }
}
