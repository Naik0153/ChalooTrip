import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '27.1751');
  const lng = parseFloat(searchParams.get('lng') || '78.0421');

  try {
    const weather = await fetchLiveWeather(lat, lng);
    return NextResponse.json(weather);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch weather' }, { status: 500 });
  }
}
