import PathName from '@/app/components/PathName'
import React from 'react'
import AdminMedia from './components/AdminMedia'
import { getAuthAndRedirectLogin } from '@/app/actions'

export default async function AdminMediaPage() {
	await getAuthAndRedirectLogin()

	return (
		<>
			<AdminMedia />
			<PathName />
		</>
	)
}
