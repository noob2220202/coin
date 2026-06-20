import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FF6FCF',
          lav: '#8B6BFF',
          mint: '#1FD7A8',
          peach: '#FF8F5E',
          sky: '#3DAEFF',
          butter: '#FFC93D',
          'pink-soft': '#FFD6F2',
          'lav-soft': '#E3D9FF',
          'mint-soft': '#CFFBEA',
          'peach-soft': '#FFE3CC',
          'sky-soft': '#D6EEFF',
          'butter-soft': '#FFF2C7',
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
        positive: '#1FD7A8',
        negative: '#FF6FCF',
        warning: '#FF8F5E',
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
        'candy-pink': '0 8px 24px rgba(255,111,207,0.25), 0 2px 8px rgba(255,111,207,0.15)',
        'candy-lav': '0 8px 24px rgba(139,107,255,0.25), 0 2px 8px rgba(139,107,255,0.15)',
        'candy-mint': '0 8px 24px rgba(31,215,168,0.22), 0 2px 8px rgba(31,215,168,0.12)',
        'candy-sky': '0 8px 24px rgba(61,174,255,0.25), 0 2px 8px rgba(61,174,255,0.15)',
        'candy-peach': '0 8px 24px rgba(255,143,94,0.22), 0 2px 8px rgba(255,143,94,0.12)',
        'candy-butter': '0 8px 24px rgba(255,201,61,0.22), 0 2px 8px rgba(255,201,61,0.12)',
        'glow-border': 'inset 0 0 0 1px rgba(139,107,255,0.2)',
        fluffy: '0 12px 32px rgba(139,107,255,0.12), 0 4px 12px rgba(255,111,207,0.10)',
        cloud: '0 10px 30px rgba(61,174,255,0.18)',
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
