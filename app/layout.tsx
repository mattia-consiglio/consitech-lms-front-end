import type { Metadata } from 'next'
import './globals.scss'
import Navbar from './components/Navbar'
import { inconsolata } from './fonts'
import Footer from './components/Footer'
import { Flowbite, ThemeModeScript } from 'flowbite-react'
import MainWrapper from './components/MainWrapper'
import { useAppSelector } from '@/redux/store'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='it'>
			<head>
				<ThemeModeScript mode='auto' />
			</head>
			<Flowbite>
				<body
					className={`${inconsolata.className} bg-body_light dark:bg-body_dark text-invert_light dark:text-invert_dark selection:bg-primary_lighter dark:selection:bg-primary_darker`}
				>
					<header className='sticky top-0 z-50'>
						<Navbar />
					</header>
					{children}
					<Footer />
				</body>
			</Flowbite>
		</html>
	)
}
