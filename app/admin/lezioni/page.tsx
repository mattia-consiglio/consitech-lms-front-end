import React from 'react'
import AdminLessons from './components/AdminLessons'
import { getAuthAndRedirectLogin } from '@/app/actions'

export default async function AdminLessonsPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminLessons />
		</>
	)
}
