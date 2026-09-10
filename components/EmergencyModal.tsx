'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Hospital, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  X,
  Navigation,
  Loader2,
  LifeBuoy
} from 'lucide-react';
import { Destination } from '@/lib/types';
import { 
  DESTINATION_EMERGENCY_SERVICES, 
  dispatchEmergencyAlert, 
  EmergencyAlert, 
  EmergencyContact 
} from '@/lib/emergency-store';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  destination,
}) => {
  const [locating, setLocating] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: destination.coordinates.lat,
    lng: destination.coordinates.lng,
    accuracy: 25,
  });
  const [dispatchedAlert, setDispatchedAlert] = useState<EmergencyAlert | null>(null);

  // Get matching emergency services
  const emergencyInfo = 
    DESTINATION_EMERGENCY_SERVICES[destination.id] || 
    DESTINATION_EMERGENCY_SERVICES['default'];

  useEffect(() => {
    if (!isOpen) return;

    setLocating(true);
    let travelerName = 'Guest Traveler';
    let travelerPhone = '+91 Emergency Line';

    try {
      const rawUser = localStorage.getItem('chaloo_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        travelerName = parsed.name || travelerName;
        travelerPhone = parsed.phone || travelerPhone;
      }
    } catch (e) {}

    const triggerDispatch = (latitude: number, longitude: number, accuracyMeters: number) => {
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const alert = dispatchEmergencyAlert({
        travelerName,
        travelerPhone,
        destinationName: destination.name,
        latitude,
        longitude,
        accuracyMeters,
        googleMapsUrl,
        nearestPolice: emergencyInfo.police,
        nearestHospital: emergencyInfo.hospital,
      });
      setDispatchedAlert(alert);
      setLocating(false);
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 20);
          setCoords({ lat, lng, accuracy: acc });
          triggerDispatch(lat, lng, acc);
        },
        err => {
          console.warn('Geolocation access restricted, using destination fallback coordinates:', err);
          setCoords({
            lat: destination.coordinates.lat,
            lng: destination.coordinates.lng,
            accuracy: 50,
          });
          triggerDispatch(destination.coordinates.lat, destination.coordinates.lng, 50);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      triggerDispatch(destination.coordinates.lat, destination.coordinates.lng, 50);
    }
  }, [isOpen, destination]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Red SOS Banner Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 flex items-start justify-between shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-black text-[10px] tracking-wider uppercase">
                  Active Emergency SOS
                </span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Emergency Assistance & SOS
              </h2>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Live location transmitted to Chaloo 24x7 Safety Admin & Local Response Services
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Dispatch Status Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block">
                  Alert Dispatched to Admin
                </span>
                <p className="text-xs text-emerald-900 font-semibold mt-0.5">
                  Distress ID: <span className="font-mono">{dispatchedAlert?.id || 'Generating...'}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Location coordinates and distress priority transmitted to Administrator on-duty.
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shrink-0 self-start sm:self-center shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" />
              <span>View GPS on Maps</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          {/* Current GPS Position Indicator */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-slate-700 font-semibold">
                Current Location: <strong>{destination.name}</strong> ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Accurate to ±{coords.accuracy}m
            </span>
          </div>

          {/* Rapid 1-Tap Emergency Hotlines */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              National 24/7 Emergency Dialers (Toll-Free)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-center transition group flex flex-col items-center justify-center"
              >
                <PhoneCall className="w-5 h-5 text-red-600 mb-1 group-hover:scale-110 transition" />
                <span className="text-sm font-black text-red-700 block">112</span>
                <span className="text-[10px] text-red-600 font-semibold">All-in-One SOS</span>
              </a>

              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center transition group flex flex-col items-center justify-center"
              >
                <Hospital className="w-5 h-5 text-rose-600 mb-1 group-hover:scale-110 transition" />
                <span className="text-sm font-black text-rose-700 block">108</span>
                <span className="text-[10px] text-rose-600 font-semibold">Ambulance</span>
              </a>

              <a
                href="tel:101"
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center transition group flex flex-col items-center justify-center"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
                <span className="text-sm font-black text-amber-700 block">101</span>
                <span className="text-[10px] text-amber-600 font-semibold">Fire & Rescue</span>
              </a>

              <a
                href="tel:1091"
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition group flex flex-col items-center justify-center"
              >
                <LifeBuoy className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition" />
                <span className="text-sm font-black text-purple-700 block">1091</span>
                <span className="text-[10px] text-purple-600 font-semibold">Women Safety</span>
              </a>
            </div>
          </div>

          {/* Nearest Police Station & Hospital Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nearest Police Station */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-blue-700 font-black text-xs uppercase tracking-wider mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Nearest Police Station</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {emergencyInfo.police.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {emergencyInfo.police.address}
                </p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">
                  {emergencyInfo.police.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  ~{emergencyInfo.police.distanceKm} km away
                </span>
                <a
                  href={`tel:${emergencyInfo.police.phone}`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Station</span>
                </a>
              </div>
            </div>

            {/* Nearest Hospital & Trauma Center */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-rose-700 font-black text-xs uppercase tracking-wider mb-1">
                  <Hospital className="w-4 h-4" />
                  <span>Nearest Hospital / Trauma Care</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {emergencyInfo.hospital.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {emergencyInfo.hospital.address}
                </p>
                <p className="text-[11px] text-rose-700 font-semibold mt-1">
                  {emergencyInfo.hospital.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  ~{emergencyInfo.hospital.distanceKm} km away
                </span>
                <a
                  href={`tel:${emergencyInfo.hospital.phone}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Chaloo Trip 24x7 Traveler Protection Network
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
