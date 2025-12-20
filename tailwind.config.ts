import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pan-African color scheme
        'pan-african': {
          red: '#E31C23',
          black: '#000000',
          green: '#00843D',
        },
        // Additional accent colors
        accent: {
          gold: '#FFD700',
          brown: '#8B4513',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        'wide': '0.02em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
    },
  },
  plugins: [],
};
export default config;
