import React from 'react'
import MainWrapper from '../components/MainWrapper'
import ServerCousesComponent from './components/ServerCousesComponent'
import { HiHome } from 'react-icons/hi'
import PathName from '../components/PathName'

export default function CoursesPage() {
	return (
		<MainWrapper
			subheaderTitle='Corsi'
			braedcrumbItems={[{ icon: HiHome, label: 'Home', href: '/' }, { label: 'Corsi' }]}
		>
			<div className='flex justify-center'>
				<div className='lg:w-2/3 w-full'>
					<p className='text-center'>
						Con questi corsi potrai imparare a fare il tuo sito web scrivendolo. Ti consiglio di
						partire con quello di HTML e CSS, e successivamente quelli di PHP e Javascript, almeno
						le basi. Potrai scegliere successivamente sfruttare le tue conoscenze per utilizzare
						Bootstrap. Oppure se tutto ciò ti sembra troppo complicato e vuoi una soluzione semplice
						e rapida puoi scegliere Wordpress un CMS open source, con infinite possibilità di
						personalizzazione.
					</p>
				</div>
			</div>
			<ServerCousesComponent />
			<PathName />
		</MainWrapper>
	)
}
