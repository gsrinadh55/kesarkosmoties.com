module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      colors: {
        "kesar-orange": "#D97736",
        "kesar-dark": "#3E2723",
        "kesar-light": "#FAF7F2",
        "kesar-brown": "#5D4037",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^grid-cols-/,
    },
    {
      pattern: /^(sm|md|lg|xl|xs):/,
    },
    {
      pattern: /^gap-/,
    },
    {
      pattern: /^p-/,
    },
    {
      pattern: /^w-/,
    },
    {
      pattern: /^h-/,
    },
    {
      pattern: /^text-/,
    },
  ],
};
