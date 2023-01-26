/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
			},
			fontFamily: {
				sans: ['Segoe UI', 'Meiryo', ...defaultTheme.fontFamily.sans],
			},
			screens: {
        xs: "410px",
				"2xl": "1536px",
			},
    },
  },
  plugins: [],
}
