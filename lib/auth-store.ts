export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isGoogleVerified: boolean;
  role: 'user' | 'admin';
  travelPreference?: 'family' | 'couple' | 'solo' | 'group';
  welcomeBonus?: number;
  joinedDate: string;
}

export interface DispatchedEmail {
  id: string;
  bookingRef: string;
  recipientEmail: string;
  recipientName: string;
  destinationName: string;
  sentAt: string;
  subject: string;
  guideHighlights: string[];
  status: 'Delivered' | 'Pending';
}

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    name: 'Chaloo Admin',
    email: 'admin@chalootrip.com',
    phone: '+91 98765 00001',
    isEmailVerified: true,
    isPhoneVerified: true,
    isGoogleVerified: true,
    role: 'admin',
    joinedDate: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'usr-01',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    isEmailVerified: true,
    isPhoneVerified: true,
    isGoogleVerified: false,
    role: 'user',
    travelPreference: 'family',
    welcomeBonus: 500,
    joinedDate: '2026-09-01T12:30:00.000Z',
  },
  {
    id: 'usr-02',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+91 98123 45678',
    isEmailVerified: true,
    isPhoneVerified: true,
    isGoogleVerified: true,
    role: 'user',
    travelPreference: 'couple',
    welcomeBonus: 500,
    joinedDate: '2026-09-02T14:15:00.000Z',
  },
  {
    id: 'usr-03',
    name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    phone: '+91 99887 76655',
    isEmailVerified: true,
    isPhoneVerified: false,
    isGoogleVerified: false,
    role: 'user',
    travelPreference: 'group',
    welcomeBonus: 500,
    joinedDate: '2026-09-03T09:45:00.000Z',
  }
];

export const SPOT_GUIDES: Record<string, {
  tagline: string;
  entryGateTips: string;
  dressCode: string;
  photographySpots: string[];
  dosAndDonts: string[];
  emergencyContact: string;
}> = {
  'kedarnath-temple': {
    tagline: 'Supreme Char Dham Himalayan Shiva Shrine at 11,755 ft',
    entryGateTips: 'VIP Fast-Track passes enter via the Mandakini riverbank north gate. Avoid morning peak between 9 AM and 11 AM.',
    dressCode: 'Warm woolen layers, thermals, windproof jackets, and comfortable trekking boots. Traditional respectful attire inside the sanctum.',
    photographySpots: [
      'Bhairavnath temple ridge overlooking the main shrine and Kedarnath peak.',
      'Mandakini river reflection point behind the shrine.',
      'Evening Aarti fire glow against the snowclad Kedar Dome.'
    ],
    dosAndDonts: [
      'Carry portable oxygen cans if prone to acute mountain sickness.',
      'Photography is strictly prohibited inside the inner sanctum.',
      'Do not throw plastic; Kedarnath is a zero-waste Himalayan zone.'
    ],
    emergencyContact: 'District Disaster Management: 1077 | Kedarnath Base Hospital: +91 1372-252101'
  },
  'taj-mahal': {
    tagline: '17th Century Mughal Architectural Wonder & UNESCO Heritage Jewel',
    entryGateTips: 'East Gate has the smoothest electric golf-cart shuttle access. Pre-booked VIP passes skip general counter queues.',
    dressCode: 'Light cotton attire in summer. Shoe covers are provided at the main marble plinth.',
    photographySpots: [
      'Central Reflecting Pool (Diana Bench classic reflection).',
      'Mosque arch frame looking out toward the main dome at sunrise.',
      'River view from Mehtab Bagh across the Yamuna.'
    ],
    dosAndDonts: [
      'Tripods, drones, and large backpacks are prohibited.',
      'Closed on Fridays for general tourism.',
      'Maintain silence inside the central mausoleum chamber.'
    ],
    emergencyContact: 'Agra Tourist Police: +91 562-2226488 | Emergency Ambulance: 108'
  },
  'rohtang-pass': {
    tagline: 'High Himalayan Snow Pass at 13,058 ft on the Pir Panjal Range',
    entryGateTips: 'NGT green permits are checked at Gulaba barrier. Enter early before 8:00 AM to beat Solang valley traffic.',
    dressCode: 'Heavy insulated snow suits, waterproof gloves, sunglasses (essential to prevent snow blindness).',
    photographySpots: [
      'Panoramic crest looking into Lahaul & Spiti valley.',
      'Geypan twin snow peaks background.',
      'Beas Kund originating spring viewpoint.'
    ],
    dosAndDonts: [
      'Keep your fuel tank full; no petrol pumps beyond Kothi.',
      'Do not venture off-trail on glacier ice without a guide.',
      'Closed for maintenance every Tuesday.'
    ],
    emergencyContact: 'Manali Police Control: +91 1902-252322 | Atal Tunnel Rescue: 112'
  },
  'baga-beach': {
    tagline: 'Goa\'s Premier Golden Shore for Watersports & Nightlife',
    entryGateTips: 'Enter via Tito\'s Lane entrance for shacks or North Baga creek bridge for quiet parking.',
    dressCode: 'Casual beachwear, swimwear, sunglasses, and high-SPF sun protection.',
    photographySpots: [
      'Baga river mouth at high tide with colorful fishing trawlers.',
      'Sunset horizon silhouette with parasailing parachutes in sky.',
      'Night shack candlelit tables on golden sand.'
    ],
    dosAndDonts: [
      'Swim only within designated lifeguard flags (Drishti Marine).',
      'Do not carry glass bottles directly into water.',
      'Confirm watersports rates and safety harness checks.'
    ],
    emergencyContact: 'Goa Coastal Police: +91 832-2419100 | Drishti Lifeguard Emergency: 108'
  },
  'default': {
    tagline: 'India\'s Premier Cultural & Scenic Landmark',
    entryGateTips: 'Show your Chaloo Trip digital QR pass directly on your smartphone at the VIP security gate.',
    dressCode: 'Modest comfortable travel clothing with sensible walking shoes.',
    photographySpots: [
      'Main entrance architectural archway.',
      'Elevated courtyard vantage point during golden hour.'
    ],
    dosAndDonts: [
      'Keep ID proof handy matching your booking name.',
      'Follow facility guidelines and maintain cleanliness.'
    ],
    emergencyContact: 'Tourist Helpline: 1800-11-1363 | National Emergency: 112'
  }
};

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem('chaloo_all_users');
    if (!raw) {
      localStorage.setItem('chaloo_all_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const users = getAllUsers();
    const existingIdx = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      users.unshift(user);
    }
    localStorage.setItem('chaloo_all_users', JSON.stringify(users));
  } catch (e) {}
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('chaloo_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('chaloo_user', JSON.stringify(user));
    saveUser(user);
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('chaloo_user');
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

// Dispatched Emails Store for Admin
export function getDispatchedEmails(): DispatchedEmail[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('chaloo_dispatched_emails');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function logDispatchedEmail(email: DispatchedEmail): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDispatchedEmails();
    current.unshift(email);
    localStorage.setItem('chaloo_dispatched_emails', JSON.stringify(current));
  } catch (e) {}
}
