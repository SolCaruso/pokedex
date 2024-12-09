/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js}',
    './js/**/*.js',
    './css/**/*.css',
    '!./node_modules/**/*',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'shimmer-dark': 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1))',
        'shimmer-light': 'linear-gradient(90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))',
      },
      fontSmoothing: ["antialiased"],
      textTransform: {
        initial: "initial",
      },
      letterSpacing: {
        initial: "initial",
      },
      colors: {
        "grass-gradient": "#85E8CC",      // Brighter green
        "grass-gradient-2": "#69B793",   // Deeper green
        "grass": "#8FCB9B",              // Base color
        "grass2": "#9EF3D7",             // Secondary color for pop

        "fire-gradient": "#FFA34A",       // More vibrant red-orange
        "fire-gradient-2": "#FF5533",    // Deeper red
        "fire": "#F48B84",               // Base color
        "fire2": "#FF9583",              // Secondary color for pop

        "water-gradient": "#78C6FA",     // Brighter blue
        "water-gradient-2": "#4A90D2",   // Deeper blue
        "water": "#87BDF9",              // Base color
        "water2": "#89D3FA",             // Secondary color for pop

        "bug-gradient": "#D8EF92",       // Brighter green
        "bug-gradient-2": "#99C974",     // Deeper green
        "bug": "#B7D97A",                // Base color
        "bug2": "#CFF286",               // Secondary color for pop

        "normal-gradient": "#F1D7B8",    // Brighter beige
        "normal-gradient-2": "#C8A582",  // Deeper beige
        "normal": "#D5C4A1",             // Base color
        "normal2": "#F7E5CA",            // Secondary color for pop

        "poison-gradient": "#C899F3",    // Brighter purple
        "poison-gradient-2": "#9D66DF",  // Richer purple
        "poison": "#B088EB",             // Base color
        "poison2": "#D0ABF6",            // Secondary color for pop

        "electric-gradient": "#FFE280",  // Brighter yellow
        "electric-gradient-2": "#F7BE3C",// Deeper yellow-orange
        "electric": "#F5D063",           // Base color
        "electric2": "#FFEA94",          // Secondary color for pop

        "ground-gradient": "#E8C69E",    // Brighter earthy brown
        "ground-gradient-2": "#A9784D",  // Rich brown
        "ground": "#D1A880",             // Base color
        "ground2": "#F0D0B0",            // Secondary color for pop

        "fairy-gradient": "#F8BFD8",     // Brighter pink
        "fairy-gradient-2": "#E583B7",   // Rich pink
        "fairy": "#F3AFCF",              // Base color
        "fairy2": "#FFCCE1",             // Secondary color for pop

        "fighting-gradient": "#A3E3D5",  // Brighter teal
        "fighting-gradient-2": "#6CA8A3",// Rich teal
        "fighting": "#8CD2C4",           // Base color
        "fighting2": "#B4F3E6",          // Secondary color for pop

        "psychic-gradient": "#B19DFE",   // Brighter purple
        "psychic-gradient-2": "#7648E0", // Deep purple
        "psychic": "#9D88F6",            // Base color
        "psychic2": "#C5B3FF",           // Secondary color for pop

        "rock-gradient": "#CACACA",      // Brighter gray
        "rock-gradient-2": "#918E8E",    // Darker gray
        "rock": "#B8B4B4",               // Base color
        "rock2": "#E2E2E2",              // Secondary color for pop

        "dragon-gradient": "#B5D9F9",    // Brighter blue
        "dragon-gradient-2": "#6391C8",  // Richer blue
        "dragon": "#A4C8F0",             // Base color
        "dragon2": "#CBE7FF",            // Secondary color for pop

        "ice-gradient": "#A6F4FA",       // Brighter icy blue
        "ice-gradient-2": "#58BDEA",     // Rich icy blue
        "ice": "#8EDBEF",                // Base color
        "ice2": "#B6F8FF",               // Secondary color for pop

        "steel-gradient": "#C4D9E5",     // Brighter gray-blue
        "steel-gradient-2": "#8399AD",   // Rich gray
        "steel": "#B5C7D3",              // Base color
        "steel2": "#DCE6EF",             // Secondary color for pop

        "ghost-gradient": "#B1A0D7",     // Brighter lavender
        "ghost-gradient-2": "#7A5FAF",   // Deeper lavender
        "ghost": "#A998C8",              // Base color
        "ghost2": "#D3B9EA",             // Secondary color for pop

        "dark-gradient": "#A385CC",      // Brighter deep purple
        "dark-gradient-2": "#5F3C8A",    // Darker purple
        "dark": "#9174B8",               // Base color
        "dark2": "#BE94D9",              // Secondary color for pop

        "flying-gradient": "#FFD065",    // Brighter orange
        "flying-gradient-2": "#E49335",  // Rich orange
        "flying": "#FFB345",             // Base color
        "flying2": "#FFE08A",            // Secondary color for pop
              },
      fontSize: {
        "2.5": "2.5rem",
        "3": "3rem",
        "4": "4rem",
        "5.5": "5.5rem",
        "2s": ".825rem",
        "2xs": ".65rem",
        "3xs": ".55rem",
        "4xs": ".45rem",
        "5xs": ".35rem",
        "6xs": ".25rem",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "system-ui",
          "BlinkMacSystemFont",
          "San Francisco",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      screens: {
        "xs": "400px",
        "2xs": "375px",
        "3xs": "390px",
        "3.5xs":"420px",
        "4xs": "430px",
        "4sm": "490px",
        "3sm": "465px",
        "2sm": "620px",
        "2md": "820px",
        "3xl": "2000px",
        'tall': { 'raw': '(min-height: 1200px)' },
        'tall2': { 'raw': '(min-height: 900px)' },
        'tallxl': { 'raw': '(min-height: 1400px)' },
        'weird': { 'raw': '(max-height: 1000px) and (min-width: 768px)' },
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      padding: {
        '30': '7.5rem',
        '1.2': '0.3125rem',
      },
      width: {
        '22': '5.5rem',
        '5.5': '1.375rem',
      },
      height: {
        '22': '5.5rem',
        '33': '2.0625rem',
      },
      scale: {
        '103': '1.03',
      },
      zIndex: {
        '-15': '-15',
      },
    },
  },
  safelist: [
      { pattern: /^bg-(grass|fire|water|bug|normal|poison|electric|ground|fairy|fighting|psychic|rock|ice|dragon|ghost|dark|steel|flying)$/ },
      'from-grass-gradient-2',
      'to-grass-gradient',
      'from-fire-gradient-2',
      'to-fire-gradient',
      'from-water-gradient-2',
      'to-water-gradient',
      'from-bug-gradient-2',
      'to-bug-gradient',
      'from-normal-gradient-2',
      'to-normal-gradient',
      'from-poison-gradient-2',
      'to-poison-gradient',
      'from-electric-gradient-2',
      'to-electric-gradient',
      'from-ground-gradient-2',
      'to-ground-gradient',
      'from-fairy-gradient-2',
      'to-fairy-gradient',
      'from-fighting-gradient-2',
      'to-fighting-gradient',
      'from-psychic-gradient-2',
      'to-psychic-gradient',
      'from-rock-gradient-2',
      'to-rock-gradient',
      'from-dragon-gradient-2',
      'to-dragon-gradient',
      'from-ice-gradient-2',
      'to-ice-gradient',
      'from-steel-gradient-2',
      'to-steel-gradient',
      'from-ghost-gradient-2',
      'to-ghost-gradient',
      'from-dark-gradient-2',
      'to-dark-gradient',
      'from-flying-gradient-2',
      'to-flying-gradient',
      'fill-grass',
      'fill-fire',
      'fill-water',
      'fill-bug',
      'fill-normal',
      'fill-poison',
      'fill-electric',
      'fill-ground',
      'fill-fairy',
      'fill-fighting',
      'fill-psychic',
      'fill-rock',
      'fill-dragon',
      'fill-ice',
      'fill-steel',
      'fill-ghost',
      'fill-dark',
      'fill-flying',
      'fill-grass2',
      'fill-fire2',
      'fill-water2',
      'fill-bug2',
      'fill-normal2',
      'fill-poison2',
      'fill-electric2',
      'fill-ground2',
      'fill-fairy2',
      'fill-fighting2',
      'fill-psychic2',
      'fill-rock2',
      'fill-dragon2',
      'fill-ice2',
      'fill-steel2',
      'fill-ghost2',
      'fill-dark2',
      'fill-flying2',
      'border-grass', 'dark:border-grass2',
      'border-fire', 'dark:border-fire2',
      'border-water', 'dark:border-water2',
      'border-bug', 'dark:border-bug2',
      'border-normal', 'dark:border-normal2',
      'border-poison', 'dark:border-poison2',
      'border-electric', 'dark:border-electric2',
      'border-ground', 'dark:border-ground2',
      'border-fairy', 'dark:border-fairy2',
      'border-fighting', 'dark:border-fighting2',
      'border-psychic', 'dark:border-psychic2',
      'border-rock', 'dark:border-rock2',
      'border-dragon', 'dark:border-dragon2',
      'border-ice', 'dark:border-ice2',
      'border-steel', 'dark:border-steel2',
      'border-ghost', 'dark:border-ghost2',
      'border-dark', 'dark:border-dark2',
      'border-flying', 'dark:border-flying2',
      'text-grass', 'dark:text-grass2',
      'text-fire', 'dark:text-fire2',
      'text-water', 'dark:text-water2',
      'text-bug', 'dark:text-bug2',
      'text-normal', 'dark:text-normal2',
      'text-poison', 'dark:text-poison2',
      'text-electric', 'dark:text-electric2',
      'text-ground', 'dark:text-ground2',
      'text-fairy', 'dark:text-fairy2',
      'text-fighting', 'dark:text-fighting2',
      'text-psychic', 'dark:text-psychic2',
      'text-rock', 'dark:text-rock2',
      'text-dragon', 'dark:text-dragon2',
      'text-ice', 'dark:text-ice2',
      'text-steel', 'dark:text-steel2',
      'text-ghost', 'dark:text-ghost2',
      'text-dark', 'dark:text-dark2',
      'text-flying', 'dark:text-flying2',
  ],
  plugins: [],
}