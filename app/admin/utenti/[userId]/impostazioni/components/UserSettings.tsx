"use client"
import MainWrapper from "@/app/components/MainWrapper"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import adminStyles from "@/app/admin/styles/admin.module.scss"
import PasswordInput from "@/app/admin/components/PasswordInput"
import { Button } from "flowbite-react"
import { customButtonTheme } from "@/app/flowbite.themes"
import { API } from "@/utils/api"
import type { User } from "@/utils/types"
import { setUser } from "@/redux/reducers/userReducer"
import toast from "react-hot-toast"
import { IoCheckmark } from "react-icons/io5"

interface IsAvailable {
	available: boolean
}

function UserSettings() {
	const { username, email } = useAppSelector((state) => state.user.data)
	const [tmpUsername, setTmpUsername] = useState<string>("")
	const [tmpEmail, setTmpEmail] = useState(email)
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [usernameAvailable, setUsernameAvailable] = useState(true)
	const [emailAvailable, setEmailAvailable] = useState(true)
	const [firstChange, setFirstChange] = useState<{
		[key: string]: boolean
		username: boolean
		email: boolean
	}>({ username: false, email: false })
	const dispatch = useAppDispatch()
	// Outside of the function, declare a variable to hold the AbortController
	const usernameAbortController = useRef<AbortController | null>(null)
	const emailAbortController = useRef<AbortController | null>(null)

	useEffect(() => {
		if (!username && !email) return
		setTmpUsername(username)
		setTmpEmail(email)
	}, [username, email])

	//check if the email is available through the API
	const checkAvailability = async (
		string: string,
		type: "username" | "email",
	) => {
		const endpoint =
			type === "username"
				? `users/username/${string}/available`
				: `users/email/${string}/available`
		let signal: AbortSignal | undefined
		if (type === "username") {
			usernameAbortController.current?.abort()
			usernameAbortController.current = new AbortController()
			signal = usernameAbortController.current.signal
		} else if (type === "email") {
			emailAbortController.current?.abort()
			emailAbortController.current = new AbortController()
			signal = emailAbortController.current.signal
		}

		try {
			const response = await API.get<IsAvailable>(endpoint, signal)
			if (type === "username") {
				setUsernameAvailable(response.available)
			} else if (type === "email") {
				setEmailAvailable(response.available)
			}
		} catch (error: unknown) {
			if (error instanceof Error && error.name === "AbortError") {
				// The request was aborted, ignore this error
				return
			}
		}
	}

	const handleFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = e.target
		if (firstChange[name]) return
		setFirstChange({ ...firstChange, [name]: true })
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === "username") {
			setTmpUsername(value)
			checkAvailability(value, "username")
			handleFirstChange(e)
		} else if (name === "email") {
			setTmpEmail(value)
			checkAvailability(value, "email")
			handleFirstChange(e)
		} else if (name === "password") {
			setNewPassword(value)
		}
	}

	const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (tmpUsername === username && tmpEmail === email) {
			return
		}

		toast
			.promise(
				API.put<User>("users/me", {
					username: tmpUsername,
					email: tmpEmail,
				}),
				{
					loading: "Salvataggio in corso...",
					success: "Salvataggio avvenuto con successo",
					error: (e) => `Errore durante il salvataggio: ${e.message}`,
				},
			)
			.then((res) => {
				dispatch(setUser(res))
			})
			.catch(() => {})
	}

	const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		toast
			.promise(
				API.put<User>("users/me/password", {
					oldPassword: oldPassword,
					newPassword: newPassword,
				}),
				{
					loading: "Salvataggio in corso...",
					success: "Salvataggio avvenuto con successo",
					error: (e) => `Errore durante il salvataggio: ${e.message}`,
				},
			)
			.then(() => {
				setNewPassword("")
				setOldPassword("")
			})
			.catch(() => {})
	}

	return (
		<MainWrapper>
			<h1>Impostazioni utente</h1>
			<h2>Profilo</h2>
			<form onSubmit={handleProfileSubmit}>
				<div>
					<label htmlFor="username">Username</label>{" "}
					<input
						type="text"
						name="username"
						value={tmpUsername}
						onChange={handleChange}
						className={`${adminStyles.input} ${!usernameAvailable ? "!border-red-500" : ""}`}
						id="username"
						required
					/>
					{firstChange.username && !usernameAvailable && (
						<p className="text-red-500">
							<b>X</b> Username non disponibile
						</p>
					)}
					{firstChange.username && usernameAvailable && (
						<p className="text-green-500">
							<IoCheckmark className="inline" /> Username disponibile
						</p>
					)}
				</div>
				<div>
					<label htmlFor="email">Email</label>{" "}
					<input
						type="text"
						name="email"
						value={tmpEmail}
						onChange={handleChange}
						className={`${adminStyles.input} ${!emailAvailable ? "!border-red-500" : ""}`}
						id="email"
						required
					/>
					{firstChange.email && !emailAvailable && (
						<p className="text-red-500">
							<b>X</b> Email non disponibile
						</p>
					)}
					{firstChange.email && emailAvailable && (
						<p className="text-green-500">
							<IoCheckmark className="inline" />
							Email disponibile
						</p>
					)}
				</div>
				<Button
					outline
					theme={customButtonTheme}
					className="mt-4"
					type="submit"
					disabled={!usernameAvailable || !emailAvailable}
				>
					Salva profilo
				</Button>
			</form>
			<hr className="my-4" />
			<h2>Password</h2>
			<form onSubmit={handlePasswordSubmit}>
				<PasswordInput
					className={adminStyles.input}
					password={oldPassword}
					setPassword={setOldPassword}
					label="Vecchia password"
					id="old-password"
					required
				/>
				<PasswordInput
					className={adminStyles.input}
					verifyStrength
					password={newPassword}
					setPassword={setNewPassword}
					label="Nuova password"
					id="new-password"
					required
				/>
				<Button
					outline
					theme={customButtonTheme}
					className="mt-4"
					type="submit"
					disabled={!newPassword || !oldPassword}
				>
					Salva password
				</Button>
			</form>
		</MainWrapper>
	)
}

export default UserSettings
