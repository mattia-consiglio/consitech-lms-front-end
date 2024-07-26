'use client'
import { Button, Tabs, TabsRef, Tooltip } from 'flowbite-react'
import React, { useMemo, useRef, useState } from 'react'
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
import { Authorization, JWT, ResponseError, User } from '@/utils/types'
import { useAppDispatch } from '@/redux/store'
import { getUserAction } from '@/redux/actions/user'
import { userLogin } from '@/redux/reducers/userReducer'
import { setCookie } from '../actions'
import { goBackAndReload, parseJwt } from '@/utils/utils'
import PasswordInput from '../admin/components/PasswordInput'

const getInitialTab = (tabQuery: string | null) => {
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
	searchParams: { [key: string]: string | string[] | undefined }
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
	const [activeTab, setActiveTab] = useState(getInitialTab(tabQuery))

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, nameInput?: string) => {
		const { name, value } = e.target
		const [type, realName] = nameInput ? nameInput.split('-') : name.split('-')

		if (type === 'login') {
			setLoginData({ ...loginData, [realName]: value })
		} else if (type === 'register') {
			setRegistrationData({ ...registrationData, [realName]: value })
		}
	}

	const login = async (data: LoginData, formForm = false) => {
		await API.post<Authorization>('auth/login', data)
			.then(response => {
				setLoginData({ usernameOrEmail: '', password: '', error: false, errorMessage: '' })
				const token: JWT = parseJwt(response.authorization)

				setCookie('token', response.authorization, token.exp * 1000 - Date.now()).then(() => {
					dispatch(getUserAction())
				})

				goBackAndReload(router)
			})
			.catch(_ => {
				formForm &&
					setLoginData({ ...loginData, error: true, errorMessage: 'Credenziali non valide' })
			})
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
	const regexSpecialCharacters = useMemo(
		() => specialChars.replace(']', '\\]').replaceAll('-', '\\-').replaceAll('/', '\\/'),
		[]
	)

	const regexCommonPattern = useMemo(() => `A-Za-z0-9\\s${regexSpecialCharacters}`, [])

	const checkLength = () => {
		return registrationData.password.length >= 15 && registrationData.password.length <= 30
	}

	const checkSpace = () => {
		const regex = /^\S*$/gm
		return regex.test(registrationData.password)
	}

	const checkUppercaseLetters = () => {
		const regex = new RegExp(
			`^(?=(?:.*[A-Z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkLowercaseLetters = () => {
		const regex = new RegExp(`^(?=(?:.*[a-z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`, 'g')
		return regex.test(registrationData.password)
	}

	const checkNumbers = () => {
		const regex = new RegExp(
			`^(?=(?:.*[0-9]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
			'gm'
		)
		return regex.test(registrationData.password)
	}

	const checkSpecialChars = () => {
		const regex = new RegExp(
			`^(?=(?:.*[${regexSpecialCharacters}]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
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
				await API.post<User>('auth/register', restOfData)
					.then(_ => {
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
						goBackAndReload(router)
					})
					.catch(error => {
						setRegistrationData({ ...registrationData, error: true, errorMessage: error.message })
					})
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
								name='login-usernameOrEmail'
								placeholder='Username o E-mail'
								className='w-full'
								value={loginData.usernameOrEmail}
								required
								onChange={handleChange}
							/>
							<PasswordInput
								password={loginData.password}
								setPassword={password => {
									setLoginData({ ...loginData, password: password })
								}}
								showPlaceholder
							/>

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
								name='register-username'
								placeholder='Username'
								className='w-full'
								minLength={3}
								value={registrationData.username}
								required
								onChange={handleChange}
							/>

							<input
								type='email'
								name='register-email'
								placeholder='E-mail'
								className='w-full'
								value={registrationData.email}
								onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
							/>
							<PasswordInput
								password={registrationData.password}
								setPassword={password => {
									setRegistrationData({ ...registrationData, password: password })
								}}
								showPlaceholder
								verifyStrength
							/>
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
