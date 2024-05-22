import React, { Suspense } from 'react'
import CourseBlock from './CourseBlock'
import { PageableContent, Course, User, UserRole } from '@/utils/types'
import { API } from '@/utils/api'
import { cookies } from 'next/headers'
import CourseModal from './CourseModal'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'

export default async function ServerCorsesComponent() {
	const nextCookies = cookies()
	const token = nextCookies.get('token')?.value
	const response = await API.get<User>('users/me')
		.then(res => res)
		.catch(error => {
			return false
		})
	const role = response ? (response !== true ? response.role : UserRole.USER) : UserRole.USER

	let responseCourses: PageableContent<Course>

	if (token) {
		// L'utente è loggato, chiama l'endpoint protetto
		responseCourses = await API.get<PageableContent<Course>>('courses').catch(error => {
			toast.error(error.message)
			return {} as PageableContent<Course>
		})
	} else {
		// L'utente non è loggato, chiama l'endpoint pubblico
		responseCourses = await API.get<PageableContent<Course>>('public/courses').catch(error => {
			toast.error(error.message)
			return {} as PageableContent<Course>
		})
	}
	const courses = responseCourses.content

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
