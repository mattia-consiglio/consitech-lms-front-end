import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
const flowbite = require('flowbite-react/tailwind')

const config: Config = {
	content: [
		flowbite.content(),
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#f49819',
				primary_lighter: '#f8b852',
				primary_darker: '#c36c00',
				body_light: colors.neutral[50],
				body_dark: colors.neutral[900],
				invert_light: {
					DEFAULT: colors.neutral[900],
					900: colors.neutral[900],
					800: colors.neutral[800],
					700: colors.neutral[700],
					600: colors.neutral[600],
					500: colors.neutral[500],
					400: colors.neutral[400],
					300: colors.neutral[300],
					200: colors.neutral[200],
					100: colors.neutral[100],
					50: colors.neutral[50],
				},
				invert_dark: {
					DEFAULT: colors.neutral[200],
					50: colors.neutral[50],
					100: colors.neutral[100],
					200: colors.neutral[200],
					300: colors.neutral[300],
					400: colors.neutral[400],
					500: colors.neutral[500],
					600: colors.neutral[600],
					700: colors.neutral[700],
					800: colors.neutral[800],
					900: colors.neutral[900],
				},
			},
			borderWidth: {
				3: '3px',
			},
			transitionDuration: {
				150: '150ms',
				250: '250ms',
			},
		},
	},
	plugins: [flowbite.plugin()],
}
export default config
