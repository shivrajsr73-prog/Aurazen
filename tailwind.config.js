/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#050505',  // Backgrounds (was light cream)
          100: '#121212', // Cards / Secondary bg
          200: '#1E1E1E', // Borders
          300: '#2A2A2A', 
          400: '#404040', 
          500: '#737373', // Muted text
          600: '#A3A3A3', 
          700: '#D4D4D4', 
          800: '#E5E5E5', 
          900: '#FAFAFA', // Primary text
        },
        accent: {
          cyan: '#00F3FF',
          purple: '#B026FF',
          magenta: '#FF00FF',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.8)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'glow-cyan': '0 0 20px rgba(0, 243, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(176, 38, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
