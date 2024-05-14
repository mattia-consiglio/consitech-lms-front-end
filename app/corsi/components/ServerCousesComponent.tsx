import React, { Suspense } from 'react'
import CourseBlock from './CourseBlock'
import { PagableContent, Course, User } from '@/utils/types'
import { API } from '@/utils/api'
import { cookies } from 'next/headers'
import CourseModal from './CourseModal'
import { redirect } from 'next/navigation'

export default async function ServerCousesComponent() {
	const nextCookies = cookies()
	const token = nextCookies.get('token')?.value
	const response = await API.get<User>('users/me')
	const user = response as User
	const role = user.role

	let data

	if (token) {
		// L'utente è loggato, chiama l'endpoint protetto
		data = await API.get<PagableContent<Course>>('courses')
	} else {
		// L'utente non è loggato, chiama l'endpoint pubblico
		data = await API.get<PagableContent<Course>>('public/courses')
	}
	const courses = 'content' in data ? data?.content : null
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 mt-4'>
				<Suspense fallback={<div>Caricamento...</div>}>
					{!courses && <div>Non ci sono corsi disponibili</div>}
					{courses &&
						courses.map(course => <CourseBlock key={course.id} role={role} {...course} />)}
				</Suspense>
			</div>
			{/* <CourseModal /> */}
		</>
	)
}
