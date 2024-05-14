import { Metadata } from 'next'
import HeroSection from './HeroSection'
import ServerCousesComponent from './corsi/components/ServerCousesComponent'
import ContentWrapper from './components/ContentWrapper'

export const metadata: Metadata = {
	title: 'Home',
	description: 'Contetech Home',
}

import { titillium_web } from './fonts'

export default function Home() {
	return (
		<>
			<main>
				<HeroSection />
				<ContentWrapper>
					<h1 className={`${titillium_web.className} text-center`}>Corsi disponibili</h1>
					<ServerCousesComponent />
				</ContentWrapper>
			</main>
		</>
	)
}
