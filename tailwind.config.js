/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050508',
        panel: '#0a0a0f',
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.15)',
        },
        text: {
          DEFAULT: '#ffffff',
          dim: 'rgba(255,255,255,0.55)',
          faint: 'rgba(255,255,255,0.35)',
        },
      },
      fontFamily: {
        orb: ['var(--font-orbitron)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
