import React from 'react'
import AdminDashboard from './components/AdminDashboard'
import { getAuthAndRedirectLogin } from '@/app/actions'

export default async function AdminDashboardPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminDashboard />
		</>
	)
}
