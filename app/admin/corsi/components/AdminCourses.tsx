'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { API } from '@/utils/api'
import { Course, PagableContent, UserRole } from '@/utils/types'
import { Button } from 'flowbite-react'
import React, { Suspense, useEffect, useState } from 'react'
import AdminCourseBlock from './AdminCourseBlock'
import { customButtonTheme } from '@/app/flowbite.themes'
import { HiOutlinePlusSm } from 'react-icons/hi'

export default function AdminCourses() {
	const [courses, setCourses] = useState<Course[]>([])

	const getCourses = async () => {
		const response = await API.get<PagableContent<Course>>('courses')
		console.log(response)
		if ('content' in response) setCourses(response.content)
	}

	useEffect(() => {
		getCourses()
	}, [])

	return (
		<MainWrapper>
			<div className='flex gap-x-4 mb-4 pl-4'>
				<h1>Corsi</h1>
				<Button theme={customButtonTheme} outline>
					<span className='flex gap-x-2 items-center'>
						<HiOutlinePlusSm />
						Aggiungi nuovo corso
					</span>
				</Button>
			</div>
			<div>
				<Suspense fallback={'Caricamento...'}>
					{!courses.length && <p>Non ci sono corsi, crea il primo</p>}
					{courses.length &&
						courses.map(course => <AdminCourseBlock key={course.id} {...course} />)}
				</Suspense>
			</div>
		</MainWrapper>
	)
}
