import { getAuthAndRedirectLogin } from '@/app/actions'
import React from 'react'
import AdminCouse from './components/AdminCouse'

export default async function AdminCoursePage({ params }: { params: { course_id: string } }) {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminCouse couseId={params.course_id} />
		</>
	)
}
