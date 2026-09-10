import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chaloo Trip — AI Tourist Crowd Prediction & Smart Travel Bookings',
  description: 'Predict real-time tourist crowd levels using DeepSeek AI, Open-Meteo weather and pattern intelligence. Book attractions, flights, hotels, and cabs with crowd-optimized slots on Chaloo Trip.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=192&q=80',
  },
};

export const viewport: Viewport = {
  themeColor: '#ea2330',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=192&q=80" />
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" />
        {/* Theme Initialization & Chrome Extension Error Interceptor */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('chaloo_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}

                // Intercept third-party chrome extension unhandled message timeouts
                function isExtensionError(err) {
                  var str = (err && err.message) || (typeof err === 'string' ? err : '');
                  var filename = (err && err.filename) || '';
                  var stack = (err && err.error && err.error.stack) || (err && err.stack) || '';
                  var full = (str + ' ' + filename + ' ' + stack).toLowerCase();
                  return (
                    full.indexOf('chrome-extension://') !== -1 ||
                    full.indexOf('chrome: call method') !== -1 ||
                    full.indexOf('window message') !== -1 ||
                    full.indexOf('moz-extension://') !== -1 ||
                    full.indexOf('safari-extension://') !== -1
                  );
                }
                window.addEventListener('error', function(event) {
                  if (isExtensionError(event) || isExtensionError(event.error)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(event) {
                  if (isExtensionError(event.reason)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-red-500 selection:text-white transition-colors duration-300">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration skipped:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
