'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { setCurrentUser, UserProfile } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const validateIndianPhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateIndianPhone(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode('123456'); // Pre-fill sample OTP for convenience
    }, 600);
  };

  const handleVerifyOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length !== 6) {
      setErrorMsg('Invalid 6-digit OTP. Please enter 123456 for demo verification.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const userObj: UserProfile = {
        id: `usr-${Date.now()}`,
        name: `Traveler ${phone.slice(-4)}`,
        email: `${phone.replace(/\D/g, '')}@chalootrip.com`,
        phone: `+91 ${phone}`,
        isEmailVerified: true,
        isPhoneVerified: true,
        isGoogleVerified: false,
        role: 'user',
        travelPreference: 'family',
        welcomeBonus: 500,
        joinedDate: new Date().toISOString(),
      };
      setCurrentUser(userObj);
      router.push('/');
    }, 500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const isAdmin = email.toLowerCase() === 'admin@chalootrip.com';

      const userName = isAdmin
        ? 'Chaloo Admin'
        : (email.split('@')[0] || 'Traveler');

      const userObj: UserProfile = {
        id: isAdmin ? 'usr-admin-01' : `usr-${Date.now()}`,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email,
        phone: '+91 98765 43210',
        isEmailVerified: true,
        isPhoneVerified: true,
        isGoogleVerified: false,
        role: isAdmin ? 'admin' : 'user',
        travelPreference: 'family',
        welcomeBonus: 500,
        joinedDate: new Date().toISOString(),
      };

      setCurrentUser(userObj);
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 600);
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      const userObj: UserProfile = {
        id: `usr-${Date.now()}`,
        name: `${provider} Traveler`,
        email: `traveler@${provider.toLowerCase()}.com`,
        phone: '+91 98765 43210',
        isEmailVerified: true,
        isPhoneVerified: true,
        isGoogleVerified: provider === 'Google',
        role: 'user',
        travelPreference: 'family',
        welcomeBonus: 500,
        joinedDate: new Date().toISOString(),
      };
      setCurrentUser(userObj);
      router.push('/');
    }, 500);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-yatra-red transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chaloo Trip</span>
        </Link>
      </div>

      {/* Floating Glassmorphic Login Card */}
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yatra-red via-red-500 to-amber-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/25 mb-3">
            CT
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to <span className="text-yatra-red">ChalooTrip</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            AI Crowd Radar, Verified Fast-Track Passes & Travel Bookings
          </p>
        </div>

        {/* Tab switch between Email and Mobile OTP */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl glass-card mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setOtpSent(false); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${
              authMode === 'email'
                ? 'bg-white dark:bg-slate-700 text-yatra-red dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${
              authMode === 'otp'
                ? 'bg-white dark:bg-slate-700 text-yatra-red dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mobile Phone OTP
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Email Login Form */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com (or admin@chalootrip.com)"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Admin pass: <code className="text-amber-500">admin123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-xs sm:text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yatra-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-red-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 mt-2"
            >
              {isLoading ? <span>Verifying...</span> : <span>Log In to Account</span>}
            </button>
          </form>
        )}

        {/* Mobile Number & OTP Form */}
        {authMode === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    10-Digit Mobile Number (India)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-semibold tracking-wider"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    We will send a 6-digit SMS verification code to verify your phone.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yatra-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-red-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isLoading ? <span>Checking Number...</span> : <span>Send 6-Digit SMS OTP</span>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SMS sent to +91 {phone}. Demo OTP: <strong>123456</strong></span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-base font-mono font-black text-center tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isLoading ? <span>Verifying OTP...</span> : <span>Verify Mobile & Continue</span>}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Social Logins */}
        <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
            Or one-tap verified login with
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Verified</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.05-1.82.93-2.88-.9.04-2.02.6-2.67 1.36-.58.67-1.09 1.76-.95 2.8 1.01.08 2.07-.52 2.69-1.28" />
              </svg>
              <span>Apple ID</span>
            </button>
          </div>
        </div>

        {/* Footer link to sign up */}
        <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
          New to Chaloo Trip?{' '}
          <Link href="/signup" className="text-yatra-red dark:text-red-400 font-bold hover:underline">
            Sign Up with ₹500 Bonus
          </Link>
        </div>
      </div>
    </main>
  );
}
