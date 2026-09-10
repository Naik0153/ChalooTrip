'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Lock, 
  LogIn, 
  UserPlus, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { setCurrentUser } from '@/lib/auth-store';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export const AuthGuardModal: React.FC<AuthGuardModalProps> = ({
  isOpen,
  onClose,
  title = 'Authentication Required',
  description = 'To reserve fast-track slots, receive spot guides, and confirm travel bookings, please sign in to your Chaloo Trip account.',
  onSuccess,
}) => {
  if (!isOpen) return null;

  const handleQuickGoogleLogin = () => {
    const googleUser = {
      id: `usr-${Date.now()}`,
      name: 'Google Traveler',
      email: 'traveler@gmail.com',
      phone: '+91 98765 43210',
      isEmailVerified: true,
      isPhoneVerified: true,
      isGoogleVerified: true,
      role: 'user' as const,
      travelPreference: 'family' as const,
      welcomeBonus: 500,
      joinedDate: new Date().toISOString(),
    };
    setCurrentUser(googleUser);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-yatra-red flex items-center justify-center mx-auto shadow-md mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {description}
        </p>

        {/* Perks list */}
        <div className="mt-4 p-3 rounded-2xl glass-card text-left space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Verified Fast-Track Ticket Protection</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Automated Spot Guides & Emergency Support</span>
          </div>
        </div>

        {/* Quick Google 1-Tap */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleQuickGoogleLogin}
            className="w-full py-3 px-4 rounded-2xl glass-card text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-slate-400 flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>One-Tap Sign In with Google</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-yatra-red hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
