'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Verification State
  const [otpStep, setOtpStep] = useState(false);
  const [otpMethod, setOtpMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: any;
    if (otpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  if (!isOpen) return null;

  // Validate form and authenticate or request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number for OTP');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your confirm password.');
        return;
      }

      // Send 6-digit OTP request for signup
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-otp',
            email,
            phone,
            otpMethod,
          }),
        });
        const data = await res.json();

        if (data.success) {
          setOtpStep(true);
          setResendTimer(60);
          setCanResend(false);
          // Never expose OTP code to UI
          setSuccessMsg(`A 6-digit verification OTP has been dispatched to your ${otpMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} (${phone || email}).`);
        } else {
          setErrorMsg(data.error || 'Failed to dispatch OTP. Please check your credentials.');
        }
      } catch (err: any) {
        setOtpStep(true);
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A 6-digit verification code has been dispatched to your ${otpMethod.toUpperCase()}.`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login validation in backend
      if (!email.trim() && !phone.trim()) {
        setErrorMsg('Please enter your email or mobile number');
        return;
      }
      if (!password || password.length < 8) {
        setErrorMsg('Password must be at least 8 characters');
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'password-login',
            email,
            phone,
            password,
          }),
        });
        const data = await res.json();

        if (data.success && data.user) {
          // Successful backend password verification
          localStorage.setItem('chaloo_user', JSON.stringify({
            ...data.user,
            otpVerified: true,
          }));
          window.dispatchEvent(new Event('storage'));
          if (onAuthSuccess) onAuthSuccess(data.user);
          setIsLoading(false);
          onClose();
          return;
        }

        if (data.requireOtp) {
          // Account requires OTP verification before accessing
          // Automatically trigger OTP send
          const otpRes = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'send-otp',
              email,
              phone,
              otpMethod,
            }),
          });
          const otpData = await otpRes.json();
          setOtpStep(true);
          setResendTimer(60);
          setCanResend(false);
          setSuccessMsg(`Your account requires OTP verification. 6-digit OTP sent via ${otpMethod.toUpperCase()} to ${phone || email}.`);
          setIsLoading(false);
          return;
        }

        setErrorMsg(data.error || 'Invalid email/phone or password. Please try again.');
      } catch (err: any) {
        setErrorMsg('Authentication server connection error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Submit and verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (otpValue.trim().length !== 6) {
      setErrorMsg('Please enter the full 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode === 'signup' ? 'verify-and-register' : 'verify-and-login',
          name,
          email,
          phone,
          password,
          otp: otpValue.trim(),
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        // Successfully verified and saved in database
        localStorage.setItem('chaloo_user', JSON.stringify({
          ...data.user,
          otpVerified: true,
        }));
        window.dispatchEvent(new Event('storage'));
        if (onAuthSuccess) onAuthSuccess(data.user);
        setIsLoading(false);
        onClose();
      } else {
        setErrorMsg(data.error || 'Invalid 6-digit OTP code. Please check your SMS/WhatsApp.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg('Verification failed. Please ensure the 6-digit code matches what was sent.');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          email,
          phone,
          otpMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`Fresh 6-digit OTP has been re-sent to your ${otpMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} (${phone || email}).`);
      } else {
        setErrorMsg(data.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (e) {
      setResendTimer(60);
      setCanResend(false);
      setSuccessMsg(`A fresh 6-digit OTP has been re-sent to your ${otpMethod.toUpperCase()}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow">
              CT
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {otpStep 
                  ? 'Verify 6-Digit OTP' 
                  : mode === 'login' 
                  ? 'Sign In to Chaloo Trip' 
                  : 'Create Verified Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {otpStep 
                  ? 'Mandatory mobile/email verification to unlock all bookings'
                  : 'Requires mandatory OTP verification before accessing reservations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Only visible before OTP step) */}
        {!otpStep && (
          <div className="flex p-1.5 mx-6 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium shrink-0">
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Notification Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {successMsg}
            </div>
          )}

          {/* STEP 1: INITIAL REGISTRATION / LOGIN INPUT FORM */}
          {!otpStep ? (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number (Required for OTP Verification)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Password Input with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Password (Min. 8 characters)
                  </label>
                  {password.length > 0 && (
                    <span className={`text-[10px] font-semibold ${password.length >= 8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {password.length}/8 chars
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Only in signup mode) */}
              {mode === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    {confirmPassword.length > 0 && (
                      <span className={`text-[10px] font-semibold ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                        {password === confirmPassword ? '✓ Passwords Match' : '✗ Does not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-8 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Send OTP Channel Options (SMS vs WhatsApp) */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Receive 6-Digit OTP Via
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpMethod('sms')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition flex items-center justify-center space-x-1.5 ${
                      otpMethod === 'sms'
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpMethod('whatsapp')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition flex items-center justify-center space-x-1.5 ${
                      otpMethod === 'whatsapp'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Generating Secure 6-Digit OTP...</span>
                ) : (
                  <>
                    <span>Send 6-Digit OTP Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-DIGIT OTP VERIFICATION FORM */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  OTP sent to <b>{phone || email}</b> via {otpMethod.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">
                  Enter the 6-digit code to complete registration and access bookings
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.6em] text-xl font-mono font-bold py-2.5 rounded-xl border-2 border-red-500/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Didn&apos;t receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP Now</span>
                  </button>
                ) : (
                  <span className="font-mono text-slate-400">
                    Resend in <b>{resendTimer}s</b>
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setOtpStep(false); setOtpValue(''); setErrorMsg(''); }}
                  className="w-1/3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otpValue.length !== 6}
                  className="w-2/3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify & Unlock Account</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/60 text-center shrink-0">
          <span className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Strict OTP Verification Required • Stored Securely in Database</span>
          </span>
        </div>
      </div>
    </div>
  );
};
