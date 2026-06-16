import type { Config } from 'tailwindcss';

// The Veha design tokens, ported from the original CSS :root variables.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noir:  { DEFAULT: '#0B0B0C', 2: '#100F0D', 3: '#171511', 4: '#1F1B14' },
        gold:  { light: '#F8EAB8', DEFAULT: '#D9B85C', mid: '#C49B3F', dark: '#9A7026', deep: '#7A5818' },
        cream: { DEFAULT: '#ECE4D2', soft: '#A79E8A', dim: '#7C7461' },
        line:  { DEFAULT: 'rgba(217,184,92,.16)', strong: 'rgba(217,184,92,.30)' },
      },
      fontFamily: {
        disp: ['Cinzel', 'Georgia', 'serif'],
        edi: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
