'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Moon, 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Compass, 
  Ticket, 
  Calculator 
} from 'lucide-react';
import { getStoredBookings } from '@/lib/bookings-store';

interface NavbarProps {
  onOpenEmergency?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenEmergency,
  onOpenAuth,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize theme from document or localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('chaloo_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
      
      setIsDark(initialDark);
      if (initialDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chaloo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chaloo_theme', 'light');
    }
  };

  // Sync user state from localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem('chaloo_user');
        setCurrentUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setCurrentUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Sync bookings count
  useEffect(() => {
    const updateCount = () => {
      const bookings = getStoredBookings();
      setBookingCount(bookings.filter(b => b.status === 'Confirmed').length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('chaloo_user');
      setCurrentUser(null);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Clean, Minimal */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              CT
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Chaloo<span className="text-red-600">Trip</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Link 
              href="/"
              className="hover:text-red-600 dark:hover:text-white transition flex items-center space-x-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>
            <Link 
              href="/bookings"
              className="hover:text-red-600 dark:hover:text-white transition flex items-center space-x-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Passes</span>
              {bookingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {bookingCount}
                </span>
              )}
            </Link>
            <button 
              type="button"
              onClick={() => {
                const el = document.getElementById('budget-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-red-600 dark:hover:text-white transition flex items-center space-x-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Budget Tool</span>
            </button>
          </nav>

          {/* Right Action Trigger Buttons */}
          <div className="flex items-center space-x-2.5">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Emergency SOS Compact Trigger */}
            <button
              type="button"
              onClick={onOpenEmergency}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition transform hover:scale-102"
              title="Emergency SOS Dispatch"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-800 dark:text-white">
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs font-medium">
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white"
            >
              Explore Destinations
            </Link>
            <Link 
              href="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white"
            >
              <span>My Passes & Tickets</span>
              {bookingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {bookingCount}
                </span>
              )}
            </Link>
            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('budget-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white"
            >
              Trip Budget Calculator
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
