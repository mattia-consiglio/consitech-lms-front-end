import React from 'react'
import AdminLessons from './components/AdminLessons'
import { getAuthAndRedirectLogin } from '@/app/actions'
import PathName from '@/app/components/PathName'
import AdminContents from '../components/AdminContents'

export default async function AdminLessonsPage() {
	await getAuthAndRedirectLogin()
	return (
		<>
			<AdminContents title='Lezioni' type='lesson' />
			<PathName />
		</>
	)
}
