export interface EmergencyContact {
  name: string;
  type: 'police' | 'hospital' | 'ambulance' | 'fire' | 'helpline';
  phone: string;
  distanceKm?: number;
  address: string;
  timing?: string;
  notes?: string;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  travelerName: string;
  travelerPhone: string;
  destinationName: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  googleMapsUrl: string;
  nearestPolice: EmergencyContact;
  nearestHospital: EmergencyContact;
  status: 'ACTIVE_URGENT' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
  adminNotes?: string;
}

const STORAGE_KEY = 'chaloo_emergency_alerts_v1';

// Known Emergency Databases for Destinations in India
export const DESTINATION_EMERGENCY_SERVICES: Record<string, { police: EmergencyContact; hospital: EmergencyContact }> = {
  'kedarnath-temple': {
    police: {
      name: 'Kedarnath Police Outpost & SDRF Base Camp',
      type: 'police',
      phone: '+91 1372 267100',
      distanceKm: 0.4,
      address: 'Near Temple Plaza, Kedarnath, Rudraprayag, Uttarakhand',
      timing: '24 Hours Emergency Response',
      notes: 'State Disaster Response Force (SDRF) on site for high-altitude rescue',
    },
    hospital: {
      name: 'Six-Bed Emergency Hospital & High-Altitude Medical Post',
      type: 'hospital',
      phone: '+91 1372 267108',
      distanceKm: 0.3,
      address: 'Main Pilgrimage Path, Kedarnath Shrine Base',
      timing: '24 Hours / Trauma & Oxygen Available',
      notes: 'Equipped with Hyperbaric chambers, oxygen cylinders, and emergency helipad',
    },
  },
  'taj-mahal': {
    police: {
      name: 'Taj Mahal Tourist Police Station & Security HQ',
      type: 'police',
      phone: '+91 562 2330400',
      distanceKm: 0.2,
      address: 'East Gate Security Complex, Tajganj, Agra, Uttar Pradesh',
      timing: '24 Hours Open',
      notes: 'Dedicated Tourist Protection Squad with English & Hindi assistance',
    },
    hospital: {
      name: 'District Hospital Agra & Trauma Emergency Wing',
      type: 'hospital',
      phone: '+91 562 2420000',
      distanceKm: 2.1,
      address: 'Hospital Road, Moti Katra, Agra, Uttar Pradesh',
      timing: '24x7 Emergency Casualty Ward',
      notes: 'Multi-specialty emergency unit with cardiac ambulance fleet',
    },
  },
  'rohtang-pass': {
    police: {
      name: 'Marhi Police Checkpost & Highway Rescue Squad',
      type: 'police',
      phone: '+91 1902 252114',
      distanceKm: 4.5,
      address: 'Manali-Leh Highway, Near Rohtang Base, Himachal Pradesh',
      timing: '24 Hours Active',
      notes: 'Equipped with 4x4 snow rescue vehicles and satellite communication',
    },
    hospital: {
      name: 'Civil Hospital Manali & Mountain Emergency Care',
      type: 'hospital',
      phone: '+91 1902 253385',
      distanceKm: 18.0,
      address: 'Model Town, Manali, Himachal Pradesh',
      timing: '24 Hours Emergency Service',
      notes: 'Specialized frostbite and acute altitude sickness treatment',
    },
  },
  'baga-beach': {
    police: {
      name: 'Calangute - Baga Coastal Police Station',
      type: 'police',
      phone: '+91 832 2277900',
      distanceKm: 0.8,
      address: 'Tito\'s Lane Junction, Baga, North Goa',
      timing: '24 Hours Patrol & Assistance',
      notes: 'Coastal lifesaver coordination and quick tourist response unit',
    },
    hospital: {
      name: 'Drishti Lifesaving Beach Medical Post & Candolim Primary Health Center',
      type: 'hospital',
      phone: '+91 832 2489020',
      distanceKm: 2.4,
      address: 'Calangute-Baga Road, North Goa',
      timing: '24 Hours Casualty & Ambulance',
      notes: 'Water safety trauma specialists and emergency ambulance',
    },
  },
  'tirupati-balaji': {
    police: {
      name: 'Tirumala II Town Police Station (VGO Security Wing)',
      type: 'police',
      phone: '+91 877 2277777',
      distanceKm: 0.5,
      address: 'Ramu Bagicha, Tirumala, Tirupati, Andhra Pradesh',
      timing: '24 Hours Active Protection',
      notes: 'TTD Vigilance and Special Protection Force control center',
    },
    hospital: {
      name: 'Aswini Hospital (TTD Free Emergency Medical Center)',
      type: 'hospital',
      phone: '+91 877 2263100',
      distanceKm: 0.6,
      address: 'Santhi Nagar, Tirumala, Tirupati, Andhra Pradesh',
      timing: '24x7 Free Pilgrim Emergency Ward',
      notes: 'Full ICU, cardiac resuscitation units, and dedicated ambulance fleet',
    },
  },
  'default': {
    police: {
      name: 'District Central Police Station & Tourist Assistance Unit',
      type: 'police',
      phone: '112',
      distanceKm: 1.2,
      address: 'Main Civic Center, Nearest Central Police Line',
      timing: '24 Hours Central Emergency Helpline: 112',
      notes: 'Unified National Emergency Police Command',
    },
    hospital: {
      name: 'Civil Government Hospital & Emergency Trauma Unit',
      type: 'hospital',
      phone: '108',
      distanceKm: 1.8,
      address: 'Main Hospital Road, District Center',
      timing: '24x7 Ambulance & Emergency Helpline: 108',
      notes: 'Immediate trauma support and national ambulance dispatch',
    },
  }
};

export function getStoredEmergencyAlerts(): EmergencyAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read emergency alerts from localStorage:', err);
    return [];
  }
}

export function dispatchEmergencyAlert(alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>): EmergencyAlert {
  const current = getStoredEmergencyAlerts();
  const newAlert: EmergencyAlert = {
    ...alertData,
    id: `sos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE_URGENT',
  };

  const updated = [newAlert, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save emergency alert to localStorage:', e);
    }
  }
  return newAlert;
}

export function updateAlertStatus(
  alertId: string, 
  status: EmergencyAlert['status'], 
  adminNotes?: string
): EmergencyAlert[] {
  const current = getStoredEmergencyAlerts();
  const updated = current.map(a => {
    if (a.id === alertId) {
      return {
        ...a,
        status,
        adminNotes: adminNotes || a.adminNotes,
      };
    }
    return a;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to update alert status in localStorage:', e);
    }
  }
  return updated;
}
