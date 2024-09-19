import PathName from '@/app/components/PathName'
import React from 'react'
import UserSettings from './components/UserSettings'
import { getAuthAndRedirectLogin } from '@/app/actions'

export default async function UserSettingsPage() {
	await getAuthAndRedirectLogin()

	return (
		<>
			<UserSettings />
			<PathName />
		</>
	)
}
