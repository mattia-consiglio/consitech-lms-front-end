import { getAuthAndRedirectLogin } from '@/app/actions'
import PathName from '@/app/components/PathName'
import React from 'react'
import AdminContent from '../../components/AdminContent'

const AdminLessonPage = async ({ params }: { params: { lesson_id: string } }) => {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminContent contentId={params.lesson_id} />
			<PathName />
		</>
	)
}

export default AdminLessonPage
