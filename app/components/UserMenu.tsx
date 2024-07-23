import { userLogout } from '@/redux/reducers/userReducer'
import { UserRole } from '@/utils/types'
import { Button, Dropdown } from 'flowbite-react'
import Link from 'next/link'
import router from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { IoPerson } from 'react-icons/io5'
import { isLoggedInAction, removeCookie } from '../actions'
import { customButtonTheme } from '../flowbite.themes'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { getUserAction } from '@/redux/actions/user'
import { usePathname } from 'next/navigation'
import { CgSpinner } from 'react-icons/cg'

const UserMenu = () => {
	const {
		data: { username, email, role },
		loggedIn,
	} = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()
	const [isMounted, setIsMounted] = useState(false)
	const pathname = usePathname()

	const handleLogin = useCallback(async () => {
		const isLoggedIn = await isLoggedInAction()
		setIsMounted(true)
		if (isLoggedIn) {
			dispatch(getUserAction())
		} else {
			dispatch(userLogout())
		}
	}, [dispatch])

	useEffect(() => {
		handleLogin()
	}, [handleLogin])

	return (
		<>
			{!isMounted && <CgSpinner className='animate-spin text-xl' />}
			{!loggedIn && isMounted && (
				<Link href='/login-register' passHref>
					<Button theme={customButtonTheme} outline className='ml-2'>
						Entra/Registrati
					</Button>
				</Link>
			)}
			{loggedIn && isMounted && (
				<Dropdown
					label=''
					dismissOnClick={true}
					renderTrigger={() => (
						<button
							type='button'
							className=' border-solid border-spacing-2 border-2 border-current rounded-full flex w-8 h-8 items-center justify-center hover:text-primary !ml-4'
						>
							<IoPerson />
							<span className='sr-only'>Apri menu utente</span>
						</button>
					)}
				>
					<Dropdown.Header>
						<span className='block text-sm'>{username}</span>
						<span className='block truncate text-sm font-medium'>{email}</span>
					</Dropdown.Header>
					{role === UserRole.ADMIN && (
						<>
							<Dropdown.Item as={Link} href='/admin/dashboard' passHref>
								Admin Dashboard
							</Dropdown.Item>
							<Dropdown.Item as={Link} href='/admin/corsi' passHref>
								Admin Corsi
							</Dropdown.Item>
							<Dropdown.Item as={Link} href='/admin/lezioni' passHref>
								Admin Lezioni
							</Dropdown.Item>
							<Dropdown.Item as={Link} href='/admin/media' passHref>
								Admin Media
							</Dropdown.Item>
						</>
					)}
					<Dropdown.Item>Impostazioni</Dropdown.Item>
					<Dropdown.Item
						onClick={async () => {
							dispatch(userLogout())
							await removeCookie('token')
							dispatch(userLogout())

							if (pathname.split('/')[1] === 'admin') {
								router.push('/login')
							}
						}}
					>
						Logout
					</Dropdown.Item>
				</Dropdown>
			)}
		</>
	)
}

export default UserMenu
