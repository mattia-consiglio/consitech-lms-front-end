'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { API } from '@/utils/api'
import { Course, PagableContent, UserRole } from '@/utils/types'
import { Button } from 'flowbite-react'
import React, { Suspense, useEffect, useState } from 'react'
import AdminCourseBlock from './AdminCourseBlock'

export default function AdminCourses() {
	const [courses, setCourses] = useState<Course[]>([])

	const getCourses = async () => {
		const response = await API.get<PagableContent<Course>>('admin/courses')
		if ('content' in response) setCourses(response.content)
	}

	useEffect(() => {
		getCourses()
	}, [])

	return (
		<MainWrapper>
			<div>
				<h1>Corsi</h1>
				<Button>Aggiungi nuovo corso</Button>
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
