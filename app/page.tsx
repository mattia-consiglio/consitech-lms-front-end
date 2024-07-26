import { Metadata } from 'next'
import HeroSection from './components/HeroSection'
import ServerCorsesComponent from './corsi/components/ServerCoursesComponent'
import ContentWrapper from './components/ContentWrapper'
// import './styles/globals.scss'
import basicStyles from './styles/basics.module.scss'

export const metadata: Metadata = {
	title: 'Home',
	description: 'Contetech Home',
}

import { titillium_web } from './fonts'
import PathName from './components/PathName'

export default function Home() {
	return (
		<>
			<main>
				<HeroSection />
				<ContentWrapper>
					<h1 className={`${titillium_web.className} text-center ${basicStyles.basics}`}>
						Corsi disponibili
					</h1>
					<ServerCorsesComponent />
				</ContentWrapper>
			</main>
			<PathName />
		</>
	)
}
