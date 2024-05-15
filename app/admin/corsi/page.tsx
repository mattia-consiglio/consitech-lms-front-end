import React from 'react'
import AdminCourses from './components/AdminCourses'
import { getAuthAndRedirectLogin, getCookie } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function AdminCousersPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminCourses />
		</>
	)
}
