'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Ticket, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Search, 
  Calendar, 
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Building2,
  PhoneCall,
  Navigation,
  Check,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { 
  getAllUsers, 
  UserProfile, 
  getDispatchedEmails, 
  logDispatchedEmail, 
  DispatchedEmail,
  SPOT_GUIDES 
} from '@/lib/auth-store';
import { getStoredBookings, cancelBooking, reactivateBooking } from '@/lib/bookings-store';
import { 
  getStoredEmergencyAlerts, 
  updateAlertStatus, 
  EmergencyAlert 
} from '@/lib/emergency-store';
import { BookingRecord } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'emergency' | 'users' | 'bookings' | 'emails'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [emails, setEmails] = useState<DispatchedEmail[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewEmail, setPreviewEmail] = useState<any | null>(null);
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);

  // Load data & sync storage events
  const loadAllData = () => {
    setUsers(getAllUsers());
    setBookings(getStoredBookings());
    setEmails(getDispatchedEmails());
    setEmergencyAlerts(getStoredEmergencyAlerts());
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('storage', loadAllData);
    const interval = setInterval(loadAllData, 3000);
    return () => {
      window.removeEventListener('storage', loadAllData);
      clearInterval(interval);
    };
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status === 'Confirmed' ? b.totalAmount : 0), 0);
  const urgentAlertCount = emergencyAlerts.filter(a => a.status === 'ACTIVE_URGENT').length;

  // Helper to find spot guide
  const getSpotGuideForBooking = (bookingTitle: string) => {
    const titleLower = bookingTitle.toLowerCase();
    if (titleLower.includes('kedarnath')) return SPOT_GUIDES['kedarnath-temple'];
    if (titleLower.includes('taj')) return SPOT_GUIDES['taj-mahal'];
    if (titleLower.includes('rohtang') || titleLower.includes('manali')) return SPOT_GUIDES['rohtang-pass'];
    if (titleLower.includes('baga') || titleLower.includes('goa')) return SPOT_GUIDES['baga-beach'];
    return SPOT_GUIDES['default'];
  };

  // One-Click Email Dispatch Function
  const handleSendSpotGuideEmail = (booking: BookingRecord) => {
    const recipientEmail = booking.meta?.email || 'traveler@chalootrip.com';
    const recipientName = booking.visitorNames[0] || 'Valued Traveler';
    const guide = getSpotGuideForBooking(booking.title);

    const emailPayload: DispatchedEmail = {
      id: `mail-${Date.now()}`,
      bookingRef: booking.bookingRef,
      recipientEmail,
      recipientName,
      destinationName: booking.title,
      sentAt: new Date().toISOString(),
      subject: `Official Spot Guide & VIP E-Pass Confirmation: ${booking.title}`,
      guideHighlights: [
        guide.tagline,
        `Gate Advice: ${guide.entryGateTips}`,
        `Dress Code: ${guide.dressCode}`,
        `Emergency Contact: ${guide.emergencyContact}`
      ],
      status: 'Delivered',
    };

    logDispatchedEmail(emailPayload);
    setEmails(getDispatchedEmails());

    setPreviewEmail({
      ...emailPayload,
      fullGuide: guide,
      booking,
    });
    setSendSuccessToast(`Spot Guide Email sent to ${recipientEmail}!`);
    setTimeout(() => setSendSuccessToast(null), 5000);
  };

  // Emergency Alert Status Handler
  const handleUpdateAlert = (alertId: string, status: EmergencyAlert['status'], notes?: string) => {
    const updated = updateAlertStatus(alertId, status, notes);
    setEmergencyAlerts(updated);
    setSendSuccessToast(`Emergency Alert ${alertId} updated to ${status}`);
    setTimeout(() => setSendSuccessToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow">
                CT
              </div>
              <div>
                <span className="font-black text-lg tracking-tight">
                  Chaloo<span className="text-red-600">Admin</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 rounded-full border border-red-200">
                  Control Center
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-red-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold">Administrator</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Live Safety & Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Toast Alert */}
        {sendSuccessToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{sendSuccessToast}</span>
            </div>
            <button onClick={() => setSendSuccessToast(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Emergency SOS Counter */}
          <div className={`p-5 rounded-3xl border transition ${
            urgentAlertCount > 0 
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20 shadow-lg animate-pulse' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Emergency Distress Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2 text-red-600">
              {urgentAlertCount} Active SOS
            </div>
            <div className="text-[10px] text-slate-500 font-bold mt-1">
              • {emergencyAlerts.length} total logged distress pings
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Registered Users</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2 text-slate-900">
              {users.length}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              • Mobile & Email Verified
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Confirmed Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2 text-slate-900">
              {bookings.length}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              Fast-track passes & travel packages
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Booking Volume</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2 text-slate-900">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              Verified UPI & card payments
            </div>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'emergency', label: `🚨 Emergency SOS Alerts (${urgentAlertCount})` },
            { id: 'bookings', label: `Bookings (${bookings.length})` },
            { id: 'users', label: `Registered Travelers (${users.length})` },
            { id: 'emails', label: `Spot Guide Emails (${emails.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EMERGENCY SOS ALERTS MONITORING DESK */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-red-900 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-1.5 text-red-600" />
                  Live Traveler Distress & Emergency Dispatch Desk
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  Distress pings triggered by travelers with real-time GPS coordinates, nearest police outpost, and trauma hospitals.
                </p>
              </div>
              <span className="text-xs font-black text-red-600 bg-white px-3 py-1.5 rounded-xl border border-red-200">
                {urgentAlertCount} Active Alert(s) Pending Action
              </span>
            </div>

            {emergencyAlerts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">All Clear • No Active SOS Alerts</h4>
                <p className="text-xs text-slate-500">All travelers are safe and no distress alerts are pending.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-5 rounded-2xl border transition ${
                      alert.status === 'ACTIVE_URGENT'
                        ? 'bg-red-50/70 border-red-300 ring-2 ring-red-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                            alert.status === 'ACTIVE_URGENT'
                              ? 'bg-red-600 text-white animate-pulse'
                              : alert.status === 'DISPATCHED'
                              ? 'bg-blue-600 text-white'
                              : alert.status === 'ACKNOWLEDGED'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {alert.status.replace('_', ' ')}
                          </span>

                          <span className="font-mono text-xs font-bold text-slate-600">
                            {alert.id}
                          </span>

                          <span className="text-xs text-slate-400">
                            {new Date(alert.timestamp).toLocaleTimeString()} • {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-sm font-black text-slate-900">
                          {alert.travelerName} • <a href={`tel:${alert.travelerPhone}`} className="text-blue-600 underline">{alert.travelerPhone}</a>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>Location: <strong>{alert.destinationName}</strong> ({alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)})</span>
                          <span className="text-slate-400 font-mono text-[11px]">±{alert.accuracyMeters}m</span>
                        </div>

                        {/* Nearest Police & Hospital details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>Nearest Police Station (~{alert.nearestPolice.distanceKm} km)</span>
                            </div>
                            <p className="font-bold text-slate-900">{alert.nearestPolice.name}</p>
                            <p className="text-[11px] text-slate-500">{alert.nearestPolice.address}</p>
                            <a href={`tel:${alert.nearestPolice.phone}`} className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline pt-0.5">
                              <PhoneCall className="w-3 h-3 mr-1" />
                              Call: {alert.nearestPolice.phone}
                            </a>
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
                              <Hospital className="w-3.5 h-3.5" />
                              <span>Nearest Hospital (~{alert.nearestHospital.distanceKm} km)</span>
                            </div>
                            <p className="font-bold text-slate-900">{alert.nearestHospital.name}</p>
                            <p className="text-[11px] text-slate-500">{alert.nearestHospital.address}</p>
                            <a href={`tel:${alert.nearestHospital.phone}`} className="inline-flex items-center text-xs font-bold text-rose-600 hover:underline pt-0.5">
                              <PhoneCall className="w-3 h-3 mr-1" />
                              Call: {alert.nearestHospital.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Admin Action Controls */}
                      <div className="flex md:flex-col items-center sm:items-end space-x-2 md:space-x-0 md:space-y-2 shrink-0">
                        <a
                          href={alert.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View on Maps</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>

                        {alert.status === 'ACTIVE_URGENT' && (
                          <button
                            onClick={() => handleUpdateAlert(alert.id, 'ACKNOWLEDGED')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                          >
                            Acknowledge
                          </button>
                        )}

                        {alert.status !== 'DISPATCHED' && alert.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateAlert(alert.id, 'DISPATCHED')}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                          >
                            Dispatch Help
                          </button>
                        )}

                        {alert.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateAlert(alert.id, 'RESOLVED')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                          >
                            Resolve SOS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900">Safety & Emergency Readiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaloo Trip integrates traveler GPS distress tracking. When a traveler clicks Emergency SOS, their coordinates and nearest local hospitals/police stations are logged here for rapid assistance.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>National Emergency Police</span>
                  <span className="font-mono text-red-600">112</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>National Ambulance Hotline</span>
                  <span className="font-mono text-rose-600">108</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Fire & Disaster Response</span>
                  <span className="font-mono text-amber-600">101</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900">Spot Guide Email Dispatcher</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When travelers book passes or tours, administrators can dispatch curated spot guides containing entry gate tips, dress codes, photo spots, and local emergency hotlines with one click.
              </p>
              <button
                onClick={() => setActiveTab('bookings')}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-red-700 transition"
              >
                View Bookings & Dispatch Guides
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Customer Bookings Directory</h3>
              <span className="text-xs text-slate-500 font-bold">{bookings.length} Total Bookings</span>
            </div>

            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] border border-red-200">
                        {b.bookingRef}
                      </span>
                      <span className="font-black text-sm text-slate-900">{b.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Traveler: <strong>{b.visitorNames[0] || 'Guest'}</strong> • Date: {b.date} • Total: <strong>{formatCurrency(b.totalAmount)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleSendSpotGuideEmail(b)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Guide Email</span>
                    </button>

                    {b.status !== 'Cancelled' ? (
                      <button
                        onClick={() => {
                          if (confirm(`Cancel booking ${b.bookingRef}?`)) {
                            const updated = cancelBooking(b.id);
                            setBookings(updated);
                            setSendSuccessToast(`Booking ${b.bookingRef} cancelled.`);
                            setTimeout(() => setSendSuccessToast(null), 4000);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs transition"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const updated = reactivateBooking(b.id);
                          setBookings(updated);
                          setSendSuccessToast(`Booking ${b.bookingRef} restored to Confirmed.`);
                          setTimeout(() => setSendSuccessToast(null), 4000);
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold text-xs transition"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900">Verified Travelers Registry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map(u => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center justify-center">
                      {u.name ? u.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{u.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{u.phone}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SMS OTP Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EMAILS */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900">Dispatched Spot Guides Log</h3>
            <div className="space-y-2">
              {emails.map(m => (
                <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{m.subject}</span>
                    <p className="text-[11px] text-slate-500">To: {m.recipientEmail} ({m.recipientName}) • {new Date(m.sentAt).toLocaleString()}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Spot Guide Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-xl bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 space-y-4">
            <button onClick={() => setPreviewEmail(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-slate-900">{previewEmail.subject}</h3>
            <p className="text-xs text-slate-500">Recipient: {previewEmail.recipientEmail}</p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
              {previewEmail.guideHighlights.map((h: string, idx: number) => (
                <p key={idx}>• {h}</p>
              ))}
            </div>
            <button onClick={() => setPreviewEmail(null)} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
