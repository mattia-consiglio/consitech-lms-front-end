'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IoPerson } from 'react-icons/io5'
import { Button, DarkThemeToggle, Dropdown, useThemeMode } from 'flowbite-react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { customButtonTheme } from '../flowbite.themes'
import { userLogout } from '@/redux/reducers/userSlice'
import { log } from 'console'

function Navbar() {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const themeMode = useThemeMode()

	//do not remove the unsed the state, makes the first client render work (I don'yt kwo how)
	const [theme, setTheme] = useState(themeMode.mode)
	const [logo, setLogo] = useState('/consitech-logo-full.svg')

	const user = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()

	const menuItems = [
		{
			href: '/',
			label: 'Home',
		},
		{
			href: '/corsi',
			label: 'Corsi',
		},
		{
			href: '/blog',
			label: 'Blog',
		},
		{
			href: '/chi-sono',
			label: 'Chi sono',
		},
		{
			href: '/contatti',
			label: 'Contatti',
		},
	]

	const [, updateState] = useState(() => themeMode.setMode) //dummy state update to trigger re-render on external changes

	useEffect(() => {
		// console.log(themeMode)
		// console.log(theme)
		themeMode.setMode(themeMode.mode)
		setTheme(themeMode.mode)
		if (themeMode.mode === 'light') {
			// console.log('Light mode')
			setLogo('/consitech-logo-full.svg')
		} else {
			// console.log('Dark mode')
			setLogo('/consitech-logo-full-light.svg')
		}
	}, [theme, themeMode])

	// useEffect(() => {
	// 	console.log('Render triggered')
	// })

	return (
		<nav className='bg-body_light dark:bg-body_dark w-full z-20 top-0 start-0 border-b-0 md:border-invert_light-400 dark:border-invert_light-600 md:border-b'>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				<div>
					<Link href='/' className='items-center space-x-3 rtl:space-x-reverse flex'>
						<Image src={logo} className='h-12 ' alt='Consitech Logo' width={84.8} height={48} />
					</Link>
				</div>

				<div className='flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center'>
					<DarkThemeToggle className='rounded-none ' />
					{/* User menu */}
					{!user.loggedIn ? (
						<Link href='/login-register' passHref>
							<Button theme={customButtonTheme} outline>
								Entra/Registrati
							</Button>
						</Link>
					) : (
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
								<span className='block text-sm'>{user.data.username}</span>
								<span className='block truncate text-sm font-medium'>{user.data.email}</span>
							</Dropdown.Header>
							<Dropdown.Item>Dashboard</Dropdown.Item>
							<Dropdown.Item>Impostazioni</Dropdown.Item>
							<Dropdown.Item
								onClick={() => {
									dispatch(userLogout())
									localStorage.removeItem('token')
								}}
							>
								Logout
							</Dropdown.Item>
						</Dropdown>
					)}

					{/* Hamburger menu */}
					<button
						data-collapse-toggle='navbar-sticky'
						type='button'
						className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm  rounded-lg md:hidden hover:bg-invert_light focus:outline-none focus:ring-2 focus:ring-invert_light dark:hover:bg-invert_dark-700 dark:focus:ring-bg-invert_dark-600'
						aria-controls='navbar-sticky'
						aria-expanded={menuOpen}
						onClick={() => {
							setMenuOpen(!menuOpen)
							setUserMenuOpen(false)
						}}
					>
						<span className='sr-only'>Apri menu principale</span>
						<svg
							className='w-5 h-5'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 17 14'
						>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M1 1h15M1 7h15M1 13h15'
							/>
						</svg>
					</button>
				</div>
				<div
					className={`items-center justify-between w-full md:flex md:w-auto md:order-1${
						menuOpen ? '' : ' hidden'
					}`}
					id='navbar-sticky'
				>
					<ul
						className='flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 bg-invert_light-100 md:bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 text-center dark:border-invert_light-600 dark:bg-invert_light-800
					md:dark:bg-transparent'
					>
						{menuItems.map((item, index) => (
							<li key={index} className='flex-auto md:flex-grow md:flex md:items-center'>
								<Link
									href={item.href}
									className={`block py-2 px-3 md:p-0  ease-in-out duration-100 ${
										pathname === item.href
											? 'bg-primary  md:text-primary md:bg-transparent md:border-b-2 md:border-primary'
											: 'hover:bg-primary md:border-b-2 md:border-transparent md:hover:border-current md:hover:bg-transparent'
									}   `}
									aria-current={pathname === item.href ? 'page' : undefined}
									onClick={() => setMenuOpen(false)}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
