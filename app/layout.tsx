import type { Metadata } from 'next'
import './globals.scss'
import Navbar from './components/Navbar'
import { inconsolata } from './fonts'
import Footer from './components/Footer'
import { Flowbite, ThemeModeScript } from 'flowbite-react'
import StoreProvider from '@/redux/StoreProvider'

export const metadata: Metadata = {
	title: 'Consitech',
	description: 'Impara a programmare seplicente e ovunque',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='it'>
			<head>
				<ThemeModeScript mode='dark' />
			</head>
			<Flowbite>
				<body
					className={`${inconsolata.className} bg-body_light dark:bg-body_dark text-invert_light dark:text-invert_dark selection:bg-primary_lighter selection:text-invert_light dark:selection:bg-primary_darker dark:selection:text-invert_dark`}
				>
					<StoreProvider>
						<header className='sticky top-0 z-50'>
							<Navbar />
						</header>
						{children}
						<Footer />
					</StoreProvider>
				</body>
			</Flowbite>
		</html>
	)
}
