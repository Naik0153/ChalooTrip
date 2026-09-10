'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ShieldAlert, 
  MessageCircle,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-slate-600 dark:text-slate-300 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Trust & Rating Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          
          {/* Rating Badge */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-sm">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">4.9 / 5.0 Rating</span>
                <div className="flex text-amber-500 text-xs">
                  {'★★★★★'}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Over 142,500+ Verified Traveler Reviews
              </p>
            </div>
          </div>

          {/* 24x7 Emergency SOS Protection */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                24x7 Emergency SOS
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                GPS distress alert & nearest police/hospital dialers
              </p>
            </div>
          </div>

          {/* Safe & Instant Protection */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Secure Fast-Track Passes
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct QR entry scan & blockchain escrow proof
              </p>
            </div>
          </div>
        </div>

        {/* Middle Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow">
                CT
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Chaloo<span className="text-red-600">Trip</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              India&apos;s leading tourist travel booking, itinerary budget planning, and safety SOS platform with Web3 blockchain payment verification.
            </p>
          </div>

          {/* Quick Destination Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Featured Shrines & Destinations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Kedarnath Temple (Uttarakhand)</Link></li>
              <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Taj Mahal (Uttar Pradesh)</Link></li>
              <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Rohtang Pass & Manali (Himachal)</Link></li>
              <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Baga Beach (Goa)</Link></li>
              <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Tirupati Balaji (Andhra Pradesh)</Link></li>
            </ul>
          </div>

          {/* Official 24x7 Contact Information */}
          <div className="space-y-2 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              24x7 Traveler Helpline & Support
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-semibold text-xs">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Toll-Free Helpline</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  1800-CHALOO-TRIP (1800-242-566)
                </div>
                <div className="text-[10px] text-slate-400">Available 24 Hours, 7 Days a Week</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp & SMS Help</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  +91 98765 43210
                </div>
                <div className="text-[10px] text-slate-400">Instant Spot Guide Support</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Official Email Support</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  support@chalootrip.com
                </div>
                <div className="text-[10px] text-slate-400">Quick inquiries & voucher dispatch</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Corporate Office</span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  DLF CyberCity, Gurugram
                </div>
                <div className="text-[10px] text-slate-400">Haryana, India - 122002</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar - Cleaned, No Admin Links */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Chaloo Trip Inc. All Rights Reserved. Safe Travels &trade;.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Emergency Hotline 112</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
