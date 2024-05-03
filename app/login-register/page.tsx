'use client'
import React, { useEffect } from 'react'
import MainWrapper from '../components/MainWrapper'
import { Button, Tabs, TabsRef } from 'flowbite-react'
import { useRef, useState } from 'react'
import { customButtonTheme, customTabsTheme } from '@/app/flowbite.themes'
import { titillium_web } from '../fonts'
import { useSearchParams } from 'next/navigation'

export default function LoginRegisterPage() {
	const tabsRef = useRef<TabsRef>(null)
	const [activeTab, setActiveTab] = useState(0)
	const searchParams = useSearchParams()

	const [loginData, setLoginData] = useState({
		usernameEmail: '',
		password: '',
	})

	const [registrationData, setRegistrationData] = useState({
		username: '',
		email: '',
		password: '',
	})

	const tabQuery = searchParams.get('tab')

	useEffect(() => {
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
			tabsRef.current?.setActiveTab(tab)
		}
	}, [tabQuery])

	return (
		<MainWrapper>
			<div className='max-w-screen-sm mx-auto'>
				<div className='flex flex-col gap-3 '>
					<Tabs
						aria-label='Login / Registrazione'
						style='default'
						theme={customTabsTheme}
						ref={tabsRef}
						onActiveTabChange={tab => setActiveTab(tab)}
						className='justify-center'
					>
						<Tabs.Item active title='Login'>
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
								<p>
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
						<Tabs.Item title='Registrati'>
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
								<p>
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
