'use client'

import { setSubheaderTitle } from '@/redux/reducers/pageReducer'
import { useAppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'
import MainWrapper from '../components/MainWrapper'
import CourseBlock from './components/CourseBlock'

export default function CoursesPage() {
	return (
		<MainWrapper subheaderTitle='Corsi'>
			<div className='w-full flex justify-center'>
				<div className='w-2/3'>
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
			<div className='w-full grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 mt-4'>
				<CourseBlock
					title='HTML'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='html'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='css'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
				<CourseBlock
					title='CSS'
					description="Aggiungi stile alle tue pagine con colori, font, layout. Impara ad arricchire la struttura dell'HTML"
					img={{
						src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
						alt: 'CSS logo',
					}}
					slug='#'
				/>
			</div>
		</MainWrapper>
	)
}
