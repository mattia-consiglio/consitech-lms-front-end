import { getAuthAndRedirectLogin } from '@/app/actions'
import React from 'react'
import AdminCourse from './components/AdminCourse'
import PathName from '@/app/components/PathName'

export default async function AdminCoursePage({ params }: { params: { course_id: string } }) {
	if (params.course_id === 'new') {
		return (
			<>
				<AdminCourse courseId='new' />
				<PathName />
			</>
		)
	}
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminCourse courseId={params.course_id} />
			<PathName />
		</>
	)
}
