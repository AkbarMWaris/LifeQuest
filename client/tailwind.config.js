/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: {
          950: '#07070d',
          900: '#0a0a14',
          800: '#0e0e1a',
          700: '#131323',
          600: '#1a1a2e',
          500: '#24243c',
        },
        arcane: {
          DEFAULT: '#8b5cf6',
          50: '#f3efff',
          100: '#e4d8ff',
          200: '#c9b3ff',
          300: '#ab8bff',
          400: '#9b70ff',
          500: '#8b5cf6',
          600: '#7445e0',
          700: '#5e34b8',
        },
        gold: {
          DEFAULT: '#f5c542',
          300: '#ffdd7a',
          400: '#f9cc5c',
          500: '#f5c542',
          600: '#d9a92b',
          700: '#b8881d',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(139, 92, 246, 0.45)',
        gold: '0 0 24px -4px rgba(245, 197, 66, 0.5)',
        panel: '0 8px 40px -12px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'void-radial':
          'radial-gradient(1200px 600px at 20% -10%, rgba(139,92,246,0.16), transparent), radial-gradient(900px 500px at 100% 0%, rgba(245,197,66,0.07), transparent), radial-gradient(600px 400px at 70% 110%, rgba(52,211,153,0.05), transparent)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};