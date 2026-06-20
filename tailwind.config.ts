import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FFB5E8',
          lav: '#C9A8FF',
          mint: '#A8F5DB',
          peach: '#FFCBA4',
          sky: '#A8DCFF',
          butter: '#FFF5B8',
        },
        bg: {
          void: '#0E0720',
          deep: '#1A0F35',
          card: '#231545',
        },
        text: {
          primary: '#F4E8FF',
          secondary: '#C4A8E8',
          muted: '#7A5FA0',
        },
        border: {
          soft: 'rgba(201, 168, 255, 0.15)',
          glow: 'rgba(255, 181, 232, 0.3)',
        },
        positive: '#A8F5DB',
        negative: '#FFB5E8',
        warning: '#FFCBA4',
      },
      fontFamily: {
        gowun: ['var(--font-gowun)', 'sans-serif'],
        noto: ['var(--font-noto)', 'sans-serif'],
        space: ['var(--font-space)', 'monospace'],
        quick: ['var(--font-quick)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'candy-pink': '0 0 40px rgba(255,181,232,0.2), 0 0 80px rgba(255,181,232,0.08)',
        'candy-lav': '0 0 40px rgba(201,168,255,0.2), 0 0 80px rgba(201,168,255,0.08)',
        'candy-mint': '0 0 40px rgba(168,245,219,0.2)',
        'glow-border': 'inset 0 0 0 1px rgba(201,168,255,0.2)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-rev': 'float 8s ease-in-out infinite reverse',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        blob: 'blob 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        blob: {
          '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '33%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '66%': { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 60%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
