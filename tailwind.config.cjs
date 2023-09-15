/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				border: 'rgb(239, 243, 244)',
				'media-border': 'rgb(207, 217, 222)',
				'header-background': 'rgba(239, 243, 244, 0.85)',
				link: 'rgb(29,155,240)',
				base: '#f1f5f9', // slate-100
				'base-dark': '#0F172A', // slate-900
				primary: {
					2: '#64748b', // slate-500
					3: '#475569', // slate-600
					4: '#334155', // slate-700
					5: '#1e293b', // slate-800
					8: '#0f172a', // slate-900
					9: '#020617', // slate-950
					10: '#000',
				},
				'primary-dark': {
					2: '#64748b', // slate-500
					3: '#94a3b8', // slate-400
					4: '#cbd5e1', // slate-300
					5: '#E2E8F0', // slate-200
					8: '#f1f5f9', // slate-100
					9: '#f8fafc', // slate-50
					10: '#fff',
				},
				secondary: '#0ea5e9',
				'secondary-dark': '#38bdf8',
			},
			fontFamily: {
				sans: ['Twemoji Country Flags', 'Segoe UI', 'Meiryo', ...defaultTheme.fontFamily.sans],
			},
			screens: {
				xs: '410px',
				'2xl': '1536px',
			},
			variants: {
				float: ['responsive', 'direction'],
				margin: ['responsive', 'direction'],
				padding: ['responsive', 'direction'],
			},
		},
	},
	plugins: [require('tailwindcss-dir')()],
}
