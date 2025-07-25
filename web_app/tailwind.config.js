/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      // Pure White Palette
      white: '#ffffff',
      'white-warm': '#fefefe',
      'white-cool': '#fafbff',
      'white-pearl': '#f8f9fa',
      
      // Luxury Blue Palette
      blue: {
        50: '#f0f6ff',
        100: '#e6f1ff',
        200: '#cce4ff',
        300: '#99d0ff',
        400: '#66bcff',
        500: '#1e90ff',
        600: '#0066cc',
        700: '#004499',
        800: '#003366',
        900: '#001a33',
        950: '#000d1a',
      },
      
      // Premium Yellow/Gold Palette
      yellow: {
        50: '#fffdf0',
        100: '#fffae6',
        200: '#fff5cc',
        300: '#ffeb99',
        400: '#ffe066',
        500: '#ffd700',
        600: '#ffcc00',
        700: '#cc9900',
        800: '#996600',
        900: '#663300',
        950: '#331a00',
      },
      
      // Neutral grays (minimal use)
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      
      // Brand Colors
      primary: {
        50: '#f0f6ff',
        100: '#e6f1ff',
        200: '#cce4ff',
        300: '#99d0ff',
        400: '#66bcff',
        500: '#1e90ff',
        600: '#0066cc',
        700: '#004499',
        800: '#003366',
        900: '#001a33',
      },
      
      secondary: {
        50: '#fffdf0',
        100: '#fffae6',
        200: '#fff5cc',
        300: '#ffeb99',
        400: '#ffe066',
        500: '#ffd700',
        600: '#ffcc00',
        700: '#cc9900',
        800: '#996600',
        900: '#663300',
      },
      
      // Special luxury colors
      luxury: {
        gold: '#ffd700',
        'gold-light': '#ffeb99',
        'gold-dark': '#cc9900',
        sapphire: '#0066cc',
        'sapphire-light': '#99d0ff',
        'sapphire-dark': '#003366',
        pearl: '#f8f9fa',
        platinum: '#e6f1ff',
        midnight: '#001a33', // Added for dark backgrounds
        royal: '#1e3a8a', // Added for dark backgrounds
      },

      // Additional colors for better contrast
      black: '#000000',
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      emerald: {
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
      red: {
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
      green: {
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
      },
      purple: {
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        900: '#581c87',
      },
      pink: {
        500: '#ec4899',
      },
      orange: {
        500: '#f97316',
      },
      cyan: {
        400: '#22d3ee',
        500: '#06b6d4',
      },
      violet: {
        400: '#a78bfa',
        500: '#8b5cf6',
      },
      teal: {
        500: '#14b8a6',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'gold': '0 0 30px rgba(212, 175, 55, 0.3)',
        'platinum': '0 0 40px rgba(229, 228, 226, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for accessibility enhancements
    function({ addUtilities }) {
      const newUtilities = {
        '.focus-visible-enhanced': {
          '&:focus-visible': {
            outline: '3px solid #ffbf00',
            outlineOffset: '2px',
            boxShadow: '0 0 0 3px rgba(255, 191, 0, 0.3)',
          },
        },
        '.screen-reader-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.high-contrast': {
          filter: 'contrast(1.2)',
        },
        '.text-high-contrast': {
          color: 'rgb(255, 255, 255)',
          textShadow: '0 0 2px rgba(0, 0, 0, 0.8)',
        },
        '.bg-high-contrast': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
        },
        '.accessible-text': {
          fontSize: '1rem',
          lineHeight: '1.6',
          fontWeight: '500',
          letterSpacing: '0.025em',
        },
        // New utility classes for better text contrast
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
        },
        '.text-contrast-light': {
          color: '#ffffff',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
        },
        '.text-contrast-dark': {
          color: '#111827',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.3)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
