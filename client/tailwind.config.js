/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#ea580c',
          hover: '#c2410c',
          light: '#f97316',
          subtle: '#fff7ed',
          border: '#fed7aa',
          glow: 'rgba(234, 88, 12, 0.25)'
        },
        surface: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'pill': '0 2px 8px -1px rgba(234, 88, 12, 0.35)',
      }
    },
  },
  plugins: [],
}
