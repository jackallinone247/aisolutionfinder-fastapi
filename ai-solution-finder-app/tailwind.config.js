const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Tailwind configuration
 *
 * The design of this application closely follows the provided Base44 reference. To achieve
 * parity we define a handful of custom colours, spacing and border widths that mirror
 * the look and feel of the source application. These values were chosen by inspecting
 * the reference app rather than inventing an alternate theme. Should you wish to fine tune
 * these values further you can adjust them here.
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Brand colours derived from the reference app. The primary purple is used
         * throughout for call–to–action buttons, icons and highlights. Secondary
         * and neutral shades support the design with subtle contrast.
         */
        brand: {
          primary: '#7453d9',
          secondary: '#9e7df4',
          accent: '#f5f4ff',
          light: '#f8f8fc',
          border: '#0a0a0a',
        },
        status: {
          green: '#21bf73',
          yellow: '#f4b400',
          red: '#e53e3e',
        },
      },
      borderWidth: {
        DEFAULT: '2px',
        thick: '3px',
      },
      boxShadow: {
        card: '0 4px 0 0 #0a0a0a',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};