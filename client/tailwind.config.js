/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000', // Black
          hover: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#FF6B00', // Orange
          hover: '#e66000',
        },
        background: {
          DEFAULT: '#FFFFFF', // Pure White
          paper: '#F3F4F6', // Light Grey for contrast
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'pill': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      keyframes: {
        'rotate-orbital': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bot-animate': {
          '0%': { transform: 'scale(1) translateY(0)' },
          '100%': { transform: 'scale(1.03) translateY(-8px)' },
        },
        'slide-bg': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'title-reveal': {
          'from': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(30px) translateX(-50%)' },
          'to': { opacity: '1', transform: 'translateY(0) translateX(-50%)' },
        },
        'slide-down': {
          'from': { opacity: '0', transform: 'translateY(-20px) translateX(-50%)' },
          'to': { opacity: '1', transform: 'translateY(0) translateX(-50%)' },
        },
        'float-orb': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -20px) scale(1.05)' },
          '50%': { transform: 'translate(-10px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(-20px, -10px) scale(1.02)' },
        }
      },
      animation: {
        'rotate-orbital': 'rotate-orbital 150s linear infinite',
        'bot-animate': 'bot-animate 5s ease-in-out infinite alternate',
        'slide-bg': 'slide-bg 12s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in-left': 'fade-in-left 0.6s ease-out both',
        'fade-in-right': 'fade-in-right 0.6s ease-out both',
        'title-reveal': 'title-reveal 0.8s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-down': 'slide-down 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        'float-orb': 'float-orb 8s ease-in-out infinite',
        'float-orb-reverse': 'float-orb 10s ease-in-out infinite reverse',
      }
    },
  },
  plugins: [],
}
