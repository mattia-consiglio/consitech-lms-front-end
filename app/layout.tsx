import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import { inconsolata } from './fonts'
import Footer from './components/Footer'
import { Flowbite } from 'flowbite-react'
import StoreProvider from '@/redux/StoreProvider'
import ToasterWrapper from './ToasterWrapper'
import { getCookie } from './actions'
import './styles/globals.scss'

export const metadata: Metadata = {
	title: 'Consitech',
	description: 'Impara a programmare semplicemente e ovunque',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const isLoggedIn = async () => {
		const cookie = await getCookie('token')
		return cookie ? true : false
	}
	const theme = await getCookie('theme')
	const isLogged = await isLoggedIn()
	return (
		<html lang='it' className={theme?.value === 'dark' ? 'dark' : ''}>
			<head></head>
			<Flowbite>
				<body
					className={`${inconsolata.className} bg-body_light dark:bg-body_dark text-invert_light dark:text-invert_dark selection:bg-primary_lighter selection:text-invert_light dark:selection:bg-primary_darker dark:selection:text-invert_dark`}
				>
					<StoreProvider>
						<header className='sticky top-0 z-50'>
							<Navbar defaultTheme={theme?.value || 'dark'} isLoggedIn={isLogged} />
						</header>
						<ToasterWrapper />
						{children}
						<Footer />
					</StoreProvider>
				</body>
			</Flowbite>
		</html>
	)
}
