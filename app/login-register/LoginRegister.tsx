"use client"
import { Button, Tabs, type TabsRef } from "flowbite-react"
import type React from "react"
import { useRef, useState } from "react"
import { customButtonTheme, customTabsTheme } from "@/app/flowbite.themes"
import { titillium_web } from "../fonts"
import { useRouter } from "next/navigation"
import { API } from "@/utils/api"
import { HiInformationCircle } from "react-icons/hi"
import type { Authorization, JWT, User } from "@/utils/types"
import { useAppDispatch } from "@/redux/store"
import { getUserAction } from "@/redux/actions/user"
import { setCookie } from "../actions"
import { goBackAndReload, parseJwt } from "@/utils/utils"
import PasswordInput, { checkPassword } from "../admin/components/PasswordInput"

const getInitialTab = (tabQuery: string | null) => {
	switch (tabQuery) {
		case "0":
		case "login":
			return 0
		case "1":
		case "register":
			return 1
	}
	return 0
}
export default function LoginRegister({
	searchParams,
}: Readonly<{
	searchParams: { [key: string]: string | string[] | undefined }
}>) {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const tabQuery: string | null =
		searchParams?.tab && !Array.isArray(searchParams.tab)
			? searchParams.tab
			: null
	// console.log(tabQuery)

	// let activeTab = getInitalTab(tabQuery)
	const tabsRef = useRef<TabsRef>(null)
	const [activeTab, setActiveTab] = useState(getInitialTab(tabQuery))

	const [loginData, setLoginData] = useState({
		usernameOrEmail: "",
		password: "",
		error: false,
		errorMessage: "",
	})

	const [registrationData, setRegistrationData] = useState({
		username: "",
		email: "",
		password: "",
		error: false,
		errorMessage: "",
	})

	const isActiveTab = (tab: number) => {
		return activeTab === tab
	}

	interface LoginData {
		usernameOrEmail: string
		password: string
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		nameInput?: string,
	) => {
		const { name, value } = e.target
		const [type, realName] = nameInput ? nameInput.split("-") : name.split("-")

		if (type === "login") {
			setLoginData({ ...loginData, [realName]: value })
		} else if (type === "register") {
			setRegistrationData({ ...registrationData, [realName]: value })
		}
	}

	const login = async (data: LoginData, formForm = false) => {
		await API.post<Authorization>("auth/login", data)
			.then((response) => {
				setLoginData({
					usernameOrEmail: "",
					password: "",
					error: false,
					errorMessage: "",
				})
				const token: JWT = parseJwt(response.authorization)

				setCookie(
					"token",
					response.authorization,
					token.exp * 1000 - Date.now(),
				).then(() => {
					dispatch(getUserAction())
				})

				goBackAndReload(router)
			})
			.catch(() => {
				if (formForm)
					setLoginData({
						...loginData,
						error: true,
						errorMessage: "Credenziali non valide",
					})
			})
	}

	const loginForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (
			loginData.usernameOrEmail.trim() === "" ||
			loginData.password.trim() === ""
		) {
			setLoginData({
				...loginData,
				error: true,
				errorMessage: "Inserisci username/email e password",
			})
			return
		}

		login(
			{
				usernameOrEmail: loginData.usernameOrEmail,
				password: loginData.password,
			},
			true,
		)
	}

	const registerForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (
			registrationData.username.trim() === "" ||
			registrationData.email.trim() === "" ||
			registrationData.password.trim() === ""
		) {
			setRegistrationData({
				...registrationData,
				error: true,
				errorMessage: "Inserisci username, email e password",
			})
		} else {
			const passwordStrength = checkPassword(registrationData.password)
			if (passwordStrength) {
				const { email, password, username } = registrationData
				const registrationPostData = {
					username,
					email,
					password,
				}

				API.post<User>("auth/register", registrationPostData)
					.then(() => {
						setLoginData({
							usernameOrEmail: email,
							password: password,
							error: false,
							errorMessage: "",
						})
						login(
							{
								usernameOrEmail: email,
								password: password,
							},
							false,
						)
						setRegistrationData({
							username: "",
							email: "",
							password: "",
							error: false,
							errorMessage: "",
						})
						goBackAndReload(router)
					})
					.catch((error) => {
						setRegistrationData({
							...registrationData,
							error: true,
							errorMessage: error.message,
						})
					})
			}
		}
	}

	const handleTabChange = (tab: number) => {
		tabsRef.current?.setActiveTab(tab)
	}

	return (
		<div className="max-w-screen-sm mx-auto">
			<div className="flex flex-col gap-3 ">
				<Tabs
					aria-label="Login / Registrazione"
					style="default"
					ref={tabsRef}
					theme={customTabsTheme}
					onActiveTabChange={(tab) => setActiveTab(tab)}
					className="justify-center"
				>
					<Tabs.Item active={isActiveTab(0)} title="Login">
						<h2 className={`${titillium_web.className} text-center`}>Login</h2>
						<form
							className="mt-4 flex flex-col items-center gap-y-2"
							onSubmit={(e) => loginForm(e)}
						>
							<input
								type="text"
								name="login-usernameOrEmail"
								placeholder="Username o E-mail"
								className="w-full"
								value={loginData.usernameOrEmail}
								required
								onChange={handleChange}
							/>
							<PasswordInput
								password={loginData.password}
								setPassword={(password) => {
									setLoginData({ ...loginData, password: password })
								}}
								showPlaceholder
								required
							/>

							{loginData.error ? (
								<div className="flex px-4 py-2 border-red-800 dark:border-red-300 border-2 w-full justify-center items-center text-red-800 dark:text-red-300 bg-red-300 dark:bg-red-800 font-bold gap-x-2">
									<HiInformationCircle />
									<span>{loginData.errorMessage}</span>
								</div>
							) : (
								""
							)}
							<Button
								type="submit"
								outline
								className="w-full"
								theme={customButtonTheme}
							>
								Login
							</Button>
							<p className="text-center">
								Non sei registrato?{" "}
								<button
									className="text-primary underline cursor-pointer"
									onClick={() => handleTabChange(1)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleTabChange(1)
										}
									}}
									type="button"
									tabIndex={0}
								>
									Registrati
								</button>
							</p>
						</form>
					</Tabs.Item>
					<Tabs.Item active={isActiveTab(1)} title="Registrati">
						<h2 className={`${titillium_web.className} text-center`}>
							Registrati
						</h2>
						<form
							className="mt-4 flex flex-col items-center gap-y-2"
							onSubmit={(e) => registerForm(e)}
						>
							<input
								type="text"
								name="register-username"
								placeholder="Username"
								className="w-full"
								minLength={3}
								value={registrationData.username}
								required
								onChange={handleChange}
							/>

							<input
								type="email"
								name="register-email"
								placeholder="E-mail"
								className="w-full"
								value={registrationData.email}
								onChange={(e) =>
									setRegistrationData({
										...registrationData,
										email: e.target.value,
									})
								}
							/>
							<PasswordInput
								password={registrationData.password}
								setPassword={(password) => {
									setRegistrationData({
										...registrationData,
										password: password,
									})
								}}
								showPlaceholder
								verifyStrength
								required
							/>
							<Button
								type="submit"
								outline
								className="w-full enabled:focus-visible:bg-primary"
								theme={customButtonTheme}
							>
								Registrati
							</Button>
							<p className="text-center">
								Sei già registrato? Effettua il{" "}
								<button
									className="text-primary underline cursor-pointer"
									onClick={() => handleTabChange(0)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleTabChange(0)
										}
									}}
									type="button"
									tabIndex={0}
								>
									login
								</button>
							</p>
						</form>
					</Tabs.Item>
				</Tabs>
			</div>
		</div>
	)
}
