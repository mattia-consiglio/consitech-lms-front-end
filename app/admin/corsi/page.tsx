import React from 'react'
import AdminCourses from './components/AdminCourses'
import { getAuthAndRedirectLogin, getCookie } from '@/app/actions'
import { redirect } from 'next/navigation'
import PathName from '@/app/components/PathName'

export default async function AdminCoursersPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminCourses />
			<PathName />
		</>
	)
}
