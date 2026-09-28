/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF7',
          100: '#FDF7EE',
          200: '#F8EDDD',
          300: '#F0DEC7',
        },
        chocolate: {
          50: '#F6EFE9',
          100: '#E8D9CB',
          200: '#D2B69E',
          300: '#B08C6E',
          400: '#8C6647',
          500: '#6E4A32',
          600: '#553726',
          700: '#3E2919',
          800: '#2C1D12',
          900: '#1D130B',
        },
        caramel: {
          100: '#FBEBD4',
          200: '#F3D6AC',
          300: '#E9BC7C',
          400: '#DDA254',
          500: '#C9862F',
          600: '#A66A22',
          700: '#7E4F19',
        },
        peach: {
          100: '#FDEDE1',
          200: '#F9D9C4',
          300: '#F3BFA0',
          400: '#E8A17A',
          500: '#D98557',
        },
        sage: {
          100: '#E3EDE8',
          200: '#C3D9CE',
          300: '#96BBA9',
          400: '#6B9A85',
          500: '#4E7D69',
          600: '#3C6353',
          700: '#2F4E42',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(61, 41, 25, 0.04), 0 8px 24px -8px rgba(61, 41, 25, 0.10)',
        lift: '0 2px 4px rgba(61, 41, 25, 0.06), 0 18px 40px -12px rgba(61, 41, 25, 0.18)',
        glow: '0 8px 30px -8px rgba(201, 134, 47, 0.45)',
        inner: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'float-in': 'float-in 0.4s ease-out both',
        'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
