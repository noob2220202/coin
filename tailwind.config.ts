import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#F58FD4',
          lav: '#9C8AF2',
          mint: '#45D6B0',
          peach: '#FFA478',
          sky: '#5FBFFF',
          butter: '#FFD166',
          'pink-soft': '#FFE0F2',
          'lav-soft': '#EAE2FF',
          'mint-soft': '#D7FBEC',
          'peach-soft': '#FFE9D6',
          'sky-soft': '#DFF1FF',
          'butter-soft': '#FFF2C9',
          cloud: '#FFFFFF',
        },
        bg: {
          void: '#FFFFFF',
          deep: '#EAF6FF',
          card: '#F2EBFF',
        },
        text: {
          primary: '#4A3470',
          secondary: '#7A5FAE',
          muted: '#8B7BAE',
        },
        border: {
          soft: 'rgba(139, 107, 255, 0.18)',
          glow: 'rgba(255, 111, 207, 0.35)',
        },
        positive: '#45D6B0',
        negative: '#F58FD4',
        warning: '#FFA478',
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
        'candy-pink': '0 14px 38px rgba(245,143,212,0.16), 0 4px 12px rgba(245,143,212,0.10)',
        'candy-lav': '0 14px 38px rgba(156,138,242,0.16), 0 4px 12px rgba(156,138,242,0.10)',
        'candy-mint': '0 14px 38px rgba(69,214,176,0.14), 0 4px 12px rgba(69,214,176,0.08)',
        'candy-sky': '0 14px 38px rgba(95,191,255,0.16), 0 4px 12px rgba(95,191,255,0.10)',
        'candy-peach': '0 14px 38px rgba(255,164,120,0.14), 0 4px 12px rgba(255,164,120,0.08)',
        'candy-butter': '0 14px 38px rgba(255,209,102,0.14), 0 4px 12px rgba(255,209,102,0.08)',
        'glow-border': 'inset 0 0 0 1px rgba(156,138,242,0.14)',
        fluffy: '0 18px 44px rgba(156,138,242,0.10), 0 6px 16px rgba(245,143,212,0.07)',
        cloud: '0 12px 32px rgba(95,191,255,0.12)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-rev': 'float 8s ease-in-out infinite reverse',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        blob: 'blob 12s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2.4s ease-in-out infinite',
        wiggle: 'wiggle 1.4s ease-in-out infinite',
        twinkle: 'twinkle 2.6s ease-in-out infinite',
        drift: 'drift 16s ease-in-out infinite',
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
        'bounce-soft': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        drift: {
          '0%,100%': { transform: 'translate(0px, 0px)' },
          '25%': { transform: 'translate(18px, -14px)' },
          '50%': { transform: 'translate(-10px, 10px)' },
          '75%': { transform: 'translate(-18px, -8px)' },
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
