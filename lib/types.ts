export type CrowdLevel = 'Low' | 'Moderate' | 'Busy' | 'Surge';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type DestinationCategory = 'Temples' | 'Beaches' | 'Mountains' | 'Heritage' | 'Nature' | 'City Landmark' | 'Religious';

export interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  state: string; // e.g. "Uttar Pradesh", "Goa", "Himachal Pradesh"
  city: string;
  country: string;
  coordinates: Coordinates;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  entryFee: number; // in INR
  currency: string;
  openingHours: string;
  typicalDurationHours: number;
  baseCrowdFactor: number; // 0 - 100
  tags: string[];
}

export interface WeatherCondition {
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  humidity: number;
  isPleasant: boolean;
}

export interface HourlyCrowdPoint {
  hour: string;        // e.g. "09:00"
  hourNum: number;     // 9
  crowdScore: number;  // 0 - 100
  waitMinutes: number; // minutes
  temperature?: number;
  isCurrentHour?: boolean;
}

export interface DailyForecast {
  day: string;
  date: string;
  avgScore: number;
  level: CrowdLevel;
  peakHour: string;
  bestWindow: string;
}

export interface BestTimeSlot {
  slot: string;
  score: number;
  crowdLevel: 'Low' | 'Moderate';
  savingsLabel?: string;
  recommendationTag: 'Early Bird' | 'Sunset Golden Hour' | 'AI Recommended' | 'Off-Peak Value' | 'Aarti / Puja Time';
  reason: string;
}

export interface NearbyFacility {
  id: string;
  name: string;
  type: 'parking' | 'restroom' | 'food' | 'medical';
  distanceMeters: number;
  rating?: number;
  vicinity: string;
  statusText: string;
  isOpenNow: boolean;
}

export interface AlternativeSpot {
  id: string;
  name: string;
  category: string;
  crowdScore: number;
  crowdDifferencePercent: number;
  distanceKm: number;
  image: string;
  description: string;
  rating: number;
  whyVisit: string;
}

export interface CrowdPredictionResult {
  destinationId: string;
  destinationName: string;
  timestamp: string;
  currentScore: number;
  level: CrowdLevel;
  colorClass: string;
  waitTimeMinutes: number;
  confidencePercent: number;
  summary: string;
  hourlyData: HourlyCrowdPoint[];
  weeklyForecast: DailyForecast[];
  bestSlots: BestTimeSlot[];
  weather: WeatherCondition;
  alternatives: AlternativeSpot[];
  facilities: NearbyFacility[];
  aiReasoning: string;
}

export type BookingType = 'monument' | 'flight' | 'hotel' | 'cab' | 'package';

export type VisitorTier = 'solo' | 'couple' | 'family' | 'group' | 'senior';

export interface BookingRecord {
  id: string;
  type: BookingType;
  bookingRef: string;
  title: string;
  destinationCity: string;
  date: string;
  timeSlot?: string;
  visitorTier?: VisitorTier;
  passengersOrGuests: number;
  visitorNames: string[];
  totalAmount: number;
  currency: string;
  crowdLevelAtBooking?: CrowdLevel;
  qrCodeDataUrl?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  userRating?: number;
  userReview?: string;
  ratedAt?: string;
  tripCompleted?: boolean;
  createdAt: string;
  meta: Record<string, any>;
}
