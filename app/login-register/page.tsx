'use client'
import MainWrapper from '../components/MainWrapper'
import { Button, Tabs, TabsRef } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import { customButtonTheme, customTabsTheme } from '@/app/flowbite.themes'
import { titillium_web } from '../fonts'
import { useSearchParams } from 'next/navigation'
import styles from './login.module.scss'

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

export default function LoginRegisterPage({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
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
		usernameEmail: '',
		password: '',
	})

	const [registrationData, setRegistrationData] = useState({
		username: '',
		email: '',
		password: '',
	})

	const isActiveTab = (tab: number) => {
		return activeTab === tab
	}

	return (
		<MainWrapper className={styles.main}>
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
							<form
								className='mt-4 flex flex-col items-center gap-y-2'
								onSubmit={e => e.preventDefault()}
							>
								<input
									type='text'
									name='username-email'
									placeholder='Username o E-mail'
									className='w-full'
									value={loginData.usernameEmail}
									onChange={e => setLoginData({ ...loginData, usernameEmail: e.target.value })}
								/>
								<input
									type='password'
									name='password'
									placeholder='Password'
									className='w-full'
									value={loginData.password}
									onChange={e => setLoginData({ ...loginData, password: e.target.value })}
								/>
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
								onSubmit={e => e.preventDefault()}
							>
								<input
									type='text'
									name='username'
									placeholder='Username'
									className='w-full'
									value={registrationData.username}
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
									onChange={e =>
										setRegistrationData({ ...registrationData, email: e.target.value })
									}
								/>
								<input
									type='password'
									name='password'
									placeholder='Password'
									className='w-full'
									value={registrationData.password}
									onChange={e =>
										setRegistrationData({ ...registrationData, password: e.target.value })
									}
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
		</MainWrapper>
	)
}
