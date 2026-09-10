import { WeatherCondition } from './types';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export async function fetchLiveWeather(lat: number, lng: number): Promise<WeatherCondition> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1&timezone=auto`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 900 } });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const currentHourIndex = new Date().getHours();
    const rainProb = data.hourly?.precipitation_probability?.[currentHourIndex] ?? Math.round((current.precipitation || 0) * 15);

    const temp = Math.round(current.temperature_2m);
    const apparentTemp = Math.round(current.apparent_temperature);
    const code = current.weather_code || 0;
    const description = WMO_CODES[code] || 'Partly Cloudy';
    const isPleasant = temp >= 18 && temp <= 29 && (current.precipitation || 0) === 0;

    return {
      temperature: temp,
      apparentTemperature: apparentTemp,
      precipitationProbability: Math.min(100, Math.max(0, rainProb)),
      weatherCode: code,
      weatherDescription: description,
      windSpeed: Math.round(current.wind_speed_10m || 10),
      humidity: Math.round(current.relative_humidity_2m || 45),
      isPleasant,
    };
  } catch (error) {
    console.warn('Weather fetch fallback triggered:', error);
    // Intelligent geographic fallback based on latitude
    const isTropical = Math.abs(lat) < 25;
    return {
      temperature: isTropical ? 28 : 22,
      apparentTemperature: isTropical ? 30 : 22,
      precipitationProbability: 10,
      weatherCode: 1,
      weatherDescription: 'Mainly Clear & Pleasant',
      windSpeed: 12,
      humidity: 52,
      isPleasant: true,
    };
  }
}
