import React, { Suspense } from 'react'
import CourseBlock from './CourseBlock'
import { PagableContent, Course, User } from '@/utils/types'
import { API } from '@/utils/api'
import { cookies } from 'next/headers'

export default async function ServerCousesComponent() {
	const nextCookies = cookies()
	const token = nextCookies.get('token')?.value
	const user: User = await API.get('users/me')
	const role = user.role

	let data: PagableContent<Course>

	if (token) {
		// L'utente è loggato, chiama l'endpoint protetto
		data = await API.get('courses')
	} else {
		// L'utente non è loggato, chiama l'endpoint pubblico
		data = await API.get('public/courses')
	}
	const courses = data?.content
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 mt-4'>
			<Suspense fallback={'Caricamento'}>
				{courses.map(course => (
					<CourseBlock
						key={course.id}
						title={course.title}
						description={course.description}
						img={course.thumbnail}
						slug={course.slug}
						displayOrder={course.displayOrder}
					/>
				))}
			</Suspense>
		</div>
	)
}
