/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', card: 'var(--card)', fg: 'var(--fg)', mut: 'var(--mut)',
        bd: 'var(--bd)', pri: 'var(--pri)', soft: 'var(--soft)', navy: '#0f2a5c',
      },
    },
  },
  plugins: [],
}
