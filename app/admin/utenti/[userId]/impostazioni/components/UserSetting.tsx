'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { useAppSelector } from '@/redux/store'
import React, { use, useEffect, useState } from 'react'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import PasswordInput from '@/app/admin/components/PasswordInput'
import { Button } from 'flowbite-react'
import { customButtonTheme } from '@/app/flowbite.themes'

function UserSettings() {
	const { username, email } = useAppSelector(state => state.user.data)
	const [tmpUsername, setTmpUsername] = useState<string>('')
	const [tmpEmail, setTmpEmail] = useState(email)
	const [tmpPassword, setTmpPassword] = useState('')

	useEffect(() => {
		setTmpUsername(username)
		setTmpEmail(email)
	}, [username, email])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'username') {
			setTmpUsername(value)
		} else if (name === 'email') {
			setTmpEmail(value)
		} else if (name === 'password') {
			setTmpPassword(value)
		}
	}

	return (
		<MainWrapper>
			<h1>Impostazioni utente</h1>
			<h2>Profilo</h2>
			<form>
				<div>
					<label htmlFor='username'>Username</label>{' '}
					<input
						type='text'
						name='username'
						value={tmpUsername}
						onChange={handleChange}
						className={adminStyles.input}
						id='username'
					/>
				</div>
				<div>
					<label htmlFor='email'>Email</label>{' '}
					<input
						type='text'
						name='email'
						value={tmpEmail}
						onChange={handleChange}
						className={adminStyles.input}
						id='email'
					/>
				</div>

				<PasswordInput
					className={adminStyles.input}
					verifyStrength
					password={tmpPassword}
					setPassword={setTmpPassword}
					label='Password'
					id='password'
				/>
			</form>
		</MainWrapper>
	)
}

export default UserSettings
