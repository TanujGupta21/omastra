/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          surface: '#F5F5F5',
          light: '#FAFAFA',
        },
        elevated: '#FFFFFF',
        surface: '#F5F5F5',
        'text-primary': '#0A0A0A',
        'text-secondary': '#6B7280',
        accent: {
          DEFAULT: '#0A0A0A',
          hover: '#262626',
          dark: '#000000',
          light: '#F5F5F5',
        },
        ice: {
          DEFAULT: '#0A0A0A',
          light: '#F5F5F5',
          dark: '#000000',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
        },
        navy: {
          DEFAULT: '#0A0A0A',
          light: '#262626',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 20px 48px rgba(0,0,0,0.08)',
        'accent': '0 4px 14px rgba(0,0,0,0.25)',
        'accent-lg': '0 8px 24px rgba(0,0,0,0.3)',
        'float': '0 8px 30px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up': 'slideUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up-sm': 'slideUpSm 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-left': 'slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slideInRight 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'letter-appear': 'letterAppear 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'line-grow': 'lineGrow 0.8s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(40px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideUpSm: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInLeft: { '0%': { transform: 'translateX(-40px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(40px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.92)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        letterAppear: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        lineGrow: { '0%': { transform: 'scaleX(0)', opacity: '0', transformOrigin: 'left' }, '100%': { transform: 'scaleX(1)', opacity: '1', transformOrigin: 'left' } },
      },
    },
  },
  plugins: [],
}
