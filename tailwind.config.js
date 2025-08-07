/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrippeChalo Brand Colors
        brand: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Primary brand blue
            600: '#2563eb', // Deep brand blue
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          green: {
            50: '#f7fee7',
            100: '#ecfccb',
            200: '#d9f99d',
            300: '#bef264',
            400: '#a3e635',
            500: '#84cc16', // Primary brand green
            600: '#65a30d',
            700: '#4d7c0f',
            800: '#365314',
            900: '#1a2e05',
          },
          dark: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a', // Deep dark
          }
        },
        // Legacy support
        primary: '#2563eb',
        secondary: '#84cc16',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      scale: {
        '102': '1.02',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563eb 0%, #84cc16 100%)',
        'brand-gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #2563eb 50%, #84cc16 100%)',
        'brand-blue-gradient': 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        'brand-green-gradient': 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)',
      }
    },
  },
  plugins: [],
}