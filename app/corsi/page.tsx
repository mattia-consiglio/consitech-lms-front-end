import { setSubheaderTitle } from '@/redux/reducers/pageReducer'
import { useAppDispatch } from '@/redux/store'
import React, { Suspense, useEffect, useState } from 'react'
import MainWrapper from '../components/MainWrapper'
import CourseBlock from './CourseBlock'

export interface Couses {
	content: Course[]
	pageable: Pageable
	last: boolean
	totalPages: number
	totalElements: number
	size: number
	number: number
	sort: Sort
	first: boolean
	numberOfElements: number
	empty: boolean
}

export interface Course {
	id: string
	mainLanguage: MainLanguage
	translations: any[]
	title: string
	slug: string
	description: string
	publishStatus: string
	createdAt: Date
	displayOrder: number
	thumbnail: null
	seo: SEO
	enrolledStudents: number
}

export interface MainLanguage {
	id: string
	code: string
	language: string
}

export interface SEO {
	id: string
	mainLanguage: MainLanguage
	translations: any[]
	title: string
	description: string
	ldJSON: string
}

export interface Pageable {
	pageNumber: number
	pageSize: number
	sort: Sort
	offset: number
	unpaged: boolean
	paged: boolean
}

export interface Sort {
	empty: boolean
	unsorted: boolean
	sorted: boolean
}

async function getData() {
	const res = await fetch('http://localhost:3001/api/v1/public/courses')
	// The return value is *not* serialized
	// You can return Date, Map, Set, etc.

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	}

	return res.json()
}
export default async function CoursesPage() {
	// const [data, setData] = useState<Couses | undefined>(undefined)
	// const [courses, setCourses] = useState<Course[]>([])

	const data: Couses = await getData()
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
							img={{
								src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714646312/css-logo.png',
								alt: 'CSS logo',
							}}
							slug={course.slug}
						/>
					))}
				</Suspense>
			</div>
		</MainWrapper>
	)
}
