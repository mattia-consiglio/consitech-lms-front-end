import React from 'react'
import AdminContents from '../components/AdminContents'
import { getAuthAndRedirectLogin, getCookie } from '@/app/actions'
import { redirect } from 'next/navigation'
import PathName from '@/app/components/PathName'

export default async function AdminCoursersPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminContents title='Corsi' type='course' />
			<PathName />
		</>
	)
}
