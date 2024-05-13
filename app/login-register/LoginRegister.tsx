'use client'
import { Button, Tabs, TabsRef, Tooltip } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import { customButtonTheme, customTabsTheme } from '@/app/flowbite.themes'
import { titillium_web } from '../fonts'
import { useRouter } from 'next/navigation'
import { API } from '@/utils/api'
import {
	HiCheck,
	HiInformationCircle,
	HiOutlineEye,
	HiOutlineEyeOff,
	HiOutlineX,
} from 'react-icons/hi'
import { Authorization, ResponseError, User } from '@/utils/types'
import StoreProvider from '@/redux/StoreProvider'
import { useAppDispatch } from '@/redux/store'
import { getUserAction } from '@/redux/actions/user'

const getInitalTab = (tabQuery: string | null) => {
	let tab = 0
	if (tabQuery) {
		switch (tabQuery) {
			case '0':
			case 'login':
			default:
				tab = 0
				break
			case '1':
			case 'register':
				tab = 1
				break
		}
		return tab
	}
}

export default function LoginRegister({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const tabQuery: string | null = searchParams?.tab
		? Array.isArray(searchParams.tab)
			? null
			: searchParams.tab
		: null
	// console.log(tabQuery)

	// let activeTab = getInitalTab(tabQuery)
	const tabsRef = useRef<TabsRef>(null)
	const [activeTab, setActiveTab] = useState(getInitalTab(tabQuery))

	const [loginData, setLoginData] = useState({
		usernameOrEmail: '',
		password: '',
		error: false,
		errorMessage: '',
	})

	const [registrationData, setRegistrationData] = useState({
		username: '',
		email: '',
		password: '',
		error: false,
		errorMessage: '',
	})

	const [showPassword, setShowPassword] = useState({
		login: false,
		register: false,
	})

	const [showInfo, setShowInfo] = useState(false)

	const isActiveTab = (tab: number) => {
		return activeTab === tab
	}

	interface LoginData {
		usernameOrEmail: string
		password: string
	}

	const login = async (data: LoginData, formForm = false) => {
		const response: Authorization = await API.post('auth/login', data)
		if (!('status' in response)) {
			setLoginData({ usernameOrEmail: '', password: '', error: false, errorMessage: '' })
			localStorage.setItem('token', response.authorization)
			dispatch(getUserAction())
			router.push('/')
		} else {
			formForm ??
				setLoginData({ ...loginData, error: true, errorMessage: 'Credenziali non valide' })
		}
	}

	const loginForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (loginData.usernameOrEmail.trim() === '' || loginData.password.trim() === '') {
			setLoginData({
				...loginData,
				error: true,
				errorMessage: 'Inserisci username/email e password',
			})
			return
		}

		login(
			{
				usernameOrEmail: loginData.usernameOrEmail,
				password: loginData.password,
			},
			true
		)
	}

	const specialChars = '!@#$%^&*()-_=+{};:,<.>/?~`£€[]\\|"\''
	const safeRegex = (str: string) => {
		return str.replace(']', '\\]').replace('-', '\\-').replace('/', '\\/')
	}

	const checkLength = () => {
		return registrationData.password.length >= 15 && registrationData.password.length <= 30
	}

	const checkSpace = () => {
		const regex = /^\S*$/gm
		return regex.test(registrationData.password)
	}

	const checkUppercaseLetters = () => {
		const regex = new RegExp(
			`^(?=(?:.*[A-Z]){2,})(?!.*(.)\\1{2})[A-Za-z0-9${safeRegex(specialChars)}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkLowercaseLetters = () => {
		const regex = new RegExp(
			`^(?=(?:.*[a-z]){2,})(?!.*(.)\\1{2})[A-Za-z0-9${safeRegex(specialChars)}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkNumbers = () => {
		const regex = new RegExp(
			`^(?=(?:.*[0-9]){2,})(?!.*(.)\\1{2})[A-Za-z0-9${safeRegex(specialChars)}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkSpecialChars = () => {
		const regex = new RegExp(
			`^(?=(?:.*[${safeRegex(specialChars)}]){2,})(?!.*(.)\\1{2})[A-Za-z0-9${safeRegex(
				specialChars
			)}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkPassword = () => {
		return (
			checkLength() &&
			checkSpace() &&
			checkUppercaseLetters() &&
			checkLowercaseLetters() &&
			checkNumbers() &&
			checkSpecialChars()
		)
	}

	const registerForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (
			registrationData.username.trim() === '' ||
			registrationData.email.trim() === '' ||
			registrationData.password.trim() === ''
		) {
			setRegistrationData({
				...registrationData,
				error: true,
				errorMessage: 'Inserisci username, email e password',
			})
			return
		} else {
			const passwordStrength = checkPassword()
			if (passwordStrength) {
				const { error, errorMessage, ...restOfData } = registrationData
				const response: ResponseError | User = await API.post('auth/register', restOfData)
				if (!('status' in response)) {
					setLoginData({
						usernameOrEmail: restOfData.email,
						password: restOfData.password,
						error: false,
						errorMessage: '',
					})
					login(
						{
							usernameOrEmail: restOfData.email,
							password: restOfData.password,
						},
						false
					)
					setRegistrationData({
						username: '',
						email: '',
						password: '',
						error: false,
						errorMessage: '',
					})
					router.push('/')
				} else {
					setRegistrationData({ ...registrationData, error: true, errorMessage: response.message })
				}
			}
		}
	}

	return (
		<div className='max-w-screen-sm mx-auto'>
			<div className='flex flex-col gap-3 '>
				<Tabs
					aria-label='Login / Registrazione'
					style='default'
					ref={tabsRef}
					theme={customTabsTheme}
					onActiveTabChange={tab => setActiveTab(tab)}
					className='justify-center'
				>
					<Tabs.Item active={isActiveTab(0)} title='Login'>
						<h2 className={`${titillium_web.className} text-center`}>Login</h2>
						<form className='mt-4 flex flex-col items-center gap-y-2' onSubmit={e => loginForm(e)}>
							<input
								type='text'
								name='username-email'
								placeholder='Username o E-mail'
								className='w-full'
								value={loginData.usernameOrEmail}
								required
								onChange={e => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
							/>
							<div className='relative w-full'>
								<input
									type={showPassword.login ? 'text' : 'password'}
									name='password'
									placeholder='Password'
									className='w-full'
									value={loginData.password}
									required
									onChange={e => {
										console.log(e.target.value)
										if (e.target.value.length > 0) {
											setLoginData({ ...loginData, password: e.target.value })
										}
									}}
								/>
								<div className='absolute right-0 top-1/2 -translate-y-1/2'>
									<Tooltip content={showPassword.login ? 'Nascondi password' : 'Mostra password'}>
										<button
											type='button'
											className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl'
											onClick={() =>
												setShowPassword({ ...showPassword, login: !showPassword.login })
											}
										>
											{showPassword.login ? <HiOutlineEyeOff /> : <HiOutlineEye />}
										</button>
									</Tooltip>
								</div>
							</div>
							{loginData.error ? (
								<div className='flex px-4 py-2 border-red-800 dark:border-red-300 border-2 w-full justify-center items-center text-red-800 dark:text-red-300 bg-red-300 dark:bg-red-800 font-bold gap-x-2'>
									<HiInformationCircle />
									<span>{loginData.errorMessage}</span>
								</div>
							) : (
								''
							)}
							<Button type='submit' outline className='w-full' theme={customButtonTheme}>
								Login
							</Button>
							<p className='text-center'>
								Non sei registrato?{' '}
								<span
									className='text-primary underline cursor-pointer'
									onClick={() => tabsRef.current?.setActiveTab(1)}
								>
									Registrati
								</span>
							</p>
						</form>
					</Tabs.Item>
					<Tabs.Item active={isActiveTab(1)} title='Registrati'>
						<h2 className={`${titillium_web.className} text-center`}>Registrati</h2>
						<form
							className='mt-4 flex flex-col items-center gap-y-2'
							onSubmit={e => registerForm(e)}
						>
							<input
								type='text'
								name='username'
								placeholder='Username'
								className='w-full'
								minLength={3}
								value={registrationData.username}
								required
								onChange={e =>
									setRegistrationData({ ...registrationData, username: e.target.value })
								}
							/>
							<input
								type='email'
								name='email'
								placeholder='E-mail'
								className='w-full'
								value={registrationData.email}
								onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
							/>
							<div className='w-full relative'>
								<input
									type={showPassword.register ? 'text' : 'password'}
									name='password'
									placeholder='Password'
									className='w-full'
									value={registrationData.password}
									required
									onChange={e =>
										setRegistrationData({ ...registrationData, password: e.target.value })
									}
								/>
								<div className='absolute right-0 top-1/2 -translate-y-1/2'>
									<Tooltip content='Requisiti password'>
										<button
											type='button'
											className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded'
											onClick={() => setShowInfo(!showInfo)}
										>
											<HiInformationCircle />
										</button>
									</Tooltip>
								</div>
								<div className='absolute right-5 top-1/2 -translate-y-1/2'>
									<Tooltip
										content={showPassword.register ? 'Nascondi password' : 'Mostra password'}
									>
										<button
											type='button'
											className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl'
											onClick={() =>
												setShowPassword({ ...showPassword, register: !showPassword.register })
											}
										>
											{showPassword.register ? <HiOutlineEyeOff /> : <HiOutlineEye />}
										</button>
									</Tooltip>
								</div>
							</div>
							{showInfo ? (
								<div>
									<p>La password deve rispettare tutti i seguenti criteri</p>
									<ul>
										<li>
											{checkLength() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Deve avere una lunghezza da 15 a 50 caratteri.
										</li>
										<li>
											{checkSpace() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Non deve contenere spazi.
										</li>
										<li>
											{checkUppercaseLetters() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Deve contenere almeno 2 lettere maiuscole (non sono accettale le lettere
											accentate), ma non più di 2 uguali consecutive.
										</li>
										<li>
											{checkLowercaseLetters() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Deve contenere almeno 2 lettere miniscole (non sono accettale le lettere
											accentate), ma non più di 2 uguali consecutive.
										</li>
										<li>
											{checkNumbers() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Deve contenere almeno 2 numeri, ma non più di 2 uguali.
										</li>
										<li>
											{checkSpecialChars() ? (
												<HiCheck className='inline-block text-green-500' />
											) : (
												<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
											)}{' '}
											Deve contenere almeno 2 caratteri speciali( {specialChars} ), ma non più di 2
											uguali consecutivi tra loro.
										</li>
									</ul>
								</div>
							) : (
								''
							)}
							<Button
								type='submit'
								outline
								className='w-full enabled:focus-visible:bg-primary'
								theme={customButtonTheme}
							>
								Registrati
							</Button>
							<p className='text-center'>
								Sei già registrato? Effettua il{' '}
								<span
									className='text-primary underline cursor-pointer'
									onClick={() => tabsRef.current?.setActiveTab(0)}
								>
									login
								</span>
							</p>
						</form>
					</Tabs.Item>
				</Tabs>
			</div>
		</div>
	)
}
