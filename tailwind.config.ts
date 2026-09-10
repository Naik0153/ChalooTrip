import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yatra: {
          red: "#ea2330",
          darkred: "#c71b26",
          blue: "#1a73e8",
          darkblue: "#0d47a1",
          navy: "#0f172a",
        },
        crowd: {
          low: "#10b981",       // emerald
          moderate: "#f59e0b",  // amber
          busy: "#f97316",      // orange
          surge: "#ef4444",     // red
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
