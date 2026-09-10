import { NextRequest, NextResponse } from 'next/server';
import { POPULAR_DESTINATIONS } from '@/lib/destinations-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').toLowerCase().trim();
  const category = searchParams.get('category');

  if (!query && !category) {
    return NextResponse.json({ results: POPULAR_DESTINATIONS });
  }

  const googleKey = process.env.GOOGLE_PLACES_API_KEY;

  // If user provided Google Places API key and query has length, we can query Google Places Autocomplete
  if (googleKey && googleKey.trim() !== '' && query.length >= 2) {
    try {
      const gUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(tourist_attraction)&key=${googleKey}`;
      const gRes = await fetch(gUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.predictions && gData.predictions.length > 0) {
          const suggestions = gData.predictions.map((p: any) => ({
            id: p.place_id,
            name: p.structured_formatting?.main_text || p.description,
            city: p.structured_formatting?.secondary_text || '',
            country: '',
            category: 'Tourist Attraction',
            description: p.description,
            coordinates: { lat: 28.6139, lng: 77.2090 }, // default until details fetched
          }));
          return NextResponse.json({ results: suggestions, source: 'google' });
        }
      }
    } catch (err) {
      console.warn('Google Places API error:', err);
    }
  }

  // Fallback to internal rich destinations database
  let filtered = POPULAR_DESTINATIONS.filter(d => {
    const matchQuery = !query || 
      d.name.toLowerCase().includes(query) ||
      d.city.toLowerCase().includes(query) ||
      d.country.toLowerCase().includes(query) ||
      d.tags.some(t => t.toLowerCase().includes(query));

    const matchCategory = !category || category === 'All' || d.category === category;
    return matchQuery && matchCategory;
  });

  return NextResponse.json({ results: filtered, source: 'curated' });
}
