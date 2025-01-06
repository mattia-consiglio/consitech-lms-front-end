import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import { inconsolata } from './fonts'
import Footer from './components/Footer'
import { Flowbite } from 'flowbite-react'
import StoreProvider from '@/redux/StoreProvider'
import ToasterWrapper from './ToasterWrapper'
import { cookies } from 'next/headers'
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
	const cookieStore = await cookies()
	const theme = cookieStore.get('theme')
	return (
		<html lang='it' className={theme?.value === 'dark' ? 'dark' : ''}>
			<Flowbite>
				<body
					className={`${inconsolata.className} bg-body_light dark:bg-body_dark text-invert_light dark:text-invert_dark selection:bg-primary_lighter selection:text-invert_light dark:selection:bg-primary_darker dark:selection:text-invert_dark`}
				>
					<StoreProvider>
						<header className='sticky top-0 z-50'>
							<Navbar defaultTheme={theme?.value ?? 'dark'} />
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
