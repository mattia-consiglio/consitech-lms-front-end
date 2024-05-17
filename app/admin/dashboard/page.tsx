import React from 'react'
import AdminDashboard from './components/AdminDashboard'
import { getAuthAndRedirectLogin } from '@/app/actions'
import PathName from '@/app/components/PathName'

export default async function AdminDashboardPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminDashboard />
			<PathName />
		</>
	)
}
