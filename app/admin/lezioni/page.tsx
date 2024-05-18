import React from 'react'
import AdminLessons from './components/AdminLessons'
import { getAuthAndRedirectLogin } from '@/app/actions'
import PathName from '@/app/components/PathName'

export default async function AdminLessonsPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminLessons />
			<PathName />
		</>
	)
}
