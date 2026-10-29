/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C1B',
          900: '#0B132B',
          850: '#111C38',
          800: '#1C2541',
          700: '#263457',
          600: '#3A506B',
        },
        flood: {
          cyan: '#48CAE4',
          blue: '#0077B6',
          deep: '#03045E',
          sky: '#90E0EF',
        },
        risk: {
          low: '#10B981',       // Emerald
          moderate: '#F59E0B',  // Amber
          high: '#F97316',      // Orange
          severe: '#EF4444',    // Danger Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
