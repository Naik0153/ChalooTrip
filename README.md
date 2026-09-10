# Crowdy & Yatra Travel — AI Tourist Crowd Prediction & Smart Travel Booking

A full-stack web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **DeepSeek AI**, **Open-Meteo Weather**, **Mapbox GL JS**, and **Recharts**, seamlessly integrated with a **Yatra.com-style multi-service booking platform**.

---

## 🌟 Key Features

### 1. 🤖 AI Crowd Prediction Engine
- **Real-Time Crowd Gauge**: 0–100 score speedometer with color coding (Low, Moderate, Busy, Surge).
- **Queue Wait Times**: Estimated security and entry gate wait in minutes.
- **DeepSeek AI Reasoning**: Explains footfall dynamics based on day-of-week, current hour, and weather.
- **Open-Meteo Weather Integration**: Real-time live temperature, rain probability, wind speed, and humidity affecting crowds (free, no API key needed).
- **High-Fidelity Algorithmic Fallback**: Operates out-of-the-box even without paid API keys.

### 2. 📊 Crowd Trends & Heatmap Dashboard
- **24-Hour Hourly Breakdown**: Interactive Recharts AreaChart from 06:00 to 22:00 with peak hours highlighting and hover tooltip.
- **7-Day Weekly Forecast**: Day-by-day predictive curve distinguishing weekdays, weekends, and holidays.

### 3. ⏰ AI Best Time Recommender & Notifications
- AI-recommended slots (e.g. *Early Bird 06:30 AM – 08:30 AM: 70% less queue*).
- **"Remind me when it's less crowded"**: Web Browser Notifications API integration. Prompts permission and sends alerts when crowd levels drop.

### 4. 🗺️ Interactive Map (Mapbox GL JS + Vector Canvas Fallback)
- Dynamic crowd markers with radar halos (Green: Low, Amber: Moderate, Orange: Busy, Red: Surge).
- Map style switchers: **Streets**, **Dark**, **Satellite**, and **Outdoors**.
- Interactive fallback vector canvas when Mapbox token is not configured.

### 5. 🏛️ Smart Alternative Destinations
- AI suggests 3–5 similar, less crowded destinations nearby (e.g. *Mehtab Bagh* instead of *Taj Mahal* with -65% less crowd).
- Side-by-side comparison: distance, crowd difference, rating, and photos.

### 6. 🚻 Nearby Essential Facilities
- Instant tabs for **Parking**, **Restrooms**, **Food & Dining**, and **First Aid / Medical** with distance and open status.

### 7. 🚗 Travel & Wait Time Route Planner
- Departure recommendation (e.g. *Leave by 07:45 AM to beat the 08:30 AM rush*).
- GPS location button and transport mode comparison (Cab, Metro, Walking).

### 8. 🎫 Yatra-Style Travel Booking Platform
- **🏛️ Monument & Attraction Tickets**: Choose AI crowd-smart slot, select visitors, instant booking confirmation.
- **✈️ Flights**: Search and book flights with airport crowd level indicator.
- **🏨 Hotels**: Proximity to monuments with neighborhood traffic and crowd rating.
- **🚖 Cabs & Airport Transfers**: Guaranteed zero-wait airport and local sightseeing cabs.
- **🌴 Holiday Packages**: All-inclusive curated packages with crowd-scheduled itineraries.
- **📄 Digital QR Voucher & Ticket Generator**: Downloadable / printable boarding pass and e-ticket with scannable QR code.
- **💼 "My Bookings" Page**: Manage saved bookings in `localStorage`, view/print vouchers, and cancel bookings.

### 9. 📱 Progressive Web App (PWA)
- Offline-ready with service worker caching (`sw.js`).
- `manifest.json` for "Add to Home Screen" on mobile and desktop.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, Mapbox GL JS, Lucide React, Canvas-Confetti, QRCode
- **Backend / APIs**: Next.js Route Handlers (`/api/predict-crowd`, `/api/places`, `/api/weather`, `/api/booking`)
- **AI**: DeepSeek API with structured JSON output + fallback predictive model
- **Weather**: Open-Meteo API (free, no API key required)
- **Data & Storage**: Client-side `localStorage` state management, curated destination database (50+ spots)

---

## 🚀 Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Set your keys (all optional with graceful fallbacks):
\`\`\`env
DEEPSEEK_API_KEY=your_deepseek_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
GOOGLE_PLACES_API_KEY=your_google_places_key
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

\`\`\`
├── app/
│   ├── layout.tsx                 # Root layout with PWA meta & styles
│   ├── page.tsx                   # Main Dashboard (Search, AI Crowd, Map, Yatra Booking)
│   ├── bookings/page.tsx          # "My Bookings" page & ticket viewer
│   ├── globals.css                # Tailwind directives & custom animations
│   └── api/
│       ├── predict-crowd/route.ts # DeepSeek + Open-Meteo crowd calculation
│       ├── places/route.ts        # Places search & autocomplete
│       ├── weather/route.ts       # Open-Meteo weather proxy
│       └── booking/route.ts       # Booking reservation route
├── components/
│   ├── Navbar.tsx                 # Yatra branded header with live status
│   ├── SearchBar.tsx              # Autocomplete search & recent searches
│   ├── CrowdGauge.tsx             # Animated SVG crowd meter & wait time
│   ├── CrowdCharts.tsx            # Recharts 24h hourly & 7d forecast
│   ├── BestTimeCard.tsx           # AI optimal slots & browser notification
│   ├── MapView.tsx                # Mapbox GL JS map + vector fallback
│   ├── AlternativesCard.tsx       # 3-5 similar less crowded destinations
│   ├── FacilitiesCard.tsx         # Parking, restrooms, food, medical
│   ├── TravelPlannerCard.tsx      # Directions & departure recommendation
│   ├── YatraBookingTabs.tsx       # Multi-service booking console
│   ├── BookingModal.tsx           # Checkout modal & confetti celebration
│   └── TicketVoucher.tsx          # Printable e-ticket with live QR code
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── destinations-data.ts       # Curated 50+ world & Indian destinations
│   ├── weather.ts                 # Open-Meteo client
│   ├── deepseek.ts                # DeepSeek API client & predictive algorithm
│   ├── bookings-store.ts          # LocalStorage bookings state store
│   └── utils.ts                   # Formatting & color helpers
├── public/
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # PWA offline service worker
\`\`\`
