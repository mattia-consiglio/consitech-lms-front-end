import { getAuthAndRedirectLogin } from '@/app/actions'
import React from 'react'
import AdminContent from '../../components/AdminContent'
import PathName from '@/app/components/PathName'

export default async function AdminCoursePage({ params }: { params: { course_id: string } }) {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminContent contentId={params.course_id} />
			<PathName />
		</>
	)
}
