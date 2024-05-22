import { Inconsolata, Titillium_Web } from 'next/font/google'

export const inconsolata = Inconsolata({ subsets: ['latin'], display: 'swap' })
export const titillium_web = Titillium_Web({
	weight: ['300', '400', '700'],
	subsets: ['latin'],
	style: ['italic', 'normal'],
	display: 'swap',
})
