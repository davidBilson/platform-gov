/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      colors: {
        white: "#ffffff",
        black: "#000000",
        'boldblue': "#0B5F94",
        deepskyblue: "#009DDE",
      },
      maxWidth: {
        max: "1440px",
      },
    },
  },
  plugins: [],
}
