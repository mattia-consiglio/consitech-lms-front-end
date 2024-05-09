import { setSubheaderTitle } from '@/redux/reducers/pageReducer'
import { useAppDispatch } from '@/redux/store'
import React, { Suspense, useEffect, useState } from 'react'
import MainWrapper from '../components/MainWrapper'
import CourseBlock from './CourseBlock'
import { PagableContent, Course } from '@/utils/types'
import { API } from '@/utils/api'

export default async function CoursesPage() {
	const data: PagableContent<Course> = await API.get('public/courses')
	const courses = data?.content

	return (
		<MainWrapper subheaderTitle='Corsi'>
			<div className='flex justify-center'>
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
			<div className='grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 mt-4'>
				<Suspense fallback={'Caricamento'}>
					{courses.map(course => (
						<CourseBlock
							key={course.id}
							title={course.title}
							description={course.description}
							img={course.thumbnail}
							slug={course.slug}
						/>
					))}
				</Suspense>
			</div>
		</MainWrapper>
	)
}
