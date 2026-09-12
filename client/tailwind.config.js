/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: {
          950: 'rgb(var(--c-void-950) / <alpha-value>)',
          900: 'rgb(var(--c-void-900) / <alpha-value>)',
          800: 'rgb(var(--c-void-800) / <alpha-value>)',
          700: 'rgb(var(--c-void-700) / <alpha-value>)',
          600: 'rgb(var(--c-void-600) / <alpha-value>)',
          500: 'rgb(var(--c-void-500) / <alpha-value>)',
        },
        arcane: {
          DEFAULT: 'rgb(var(--c-arcane) / <alpha-value>)',
          50: 'rgb(var(--c-arcane-50) / <alpha-value>)',
          100: 'rgb(var(--c-arcane-100) / <alpha-value>)',
          200: 'rgb(var(--c-arcane-200) / <alpha-value>)',
          300: 'rgb(var(--c-arcane-300) / <alpha-value>)',
          400: 'rgb(var(--c-arcane-400) / <alpha-value>)',
          500: 'rgb(var(--c-arcane-500) / <alpha-value>)',
          600: 'rgb(var(--c-arcane-600) / <alpha-value>)',
          700: 'rgb(var(--c-arcane-700) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          300: 'rgb(var(--c-gold-300) / <alpha-value>)',
          400: 'rgb(var(--c-gold-400) / <alpha-value>)',
          500: 'rgb(var(--c-gold-500) / <alpha-value>)',
          600: 'rgb(var(--c-gold-600) / <alpha-value>)',
          700: 'rgb(var(--c-gold-700) / <alpha-value>)',
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