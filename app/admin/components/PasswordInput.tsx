"use client"
import { Tooltip } from "flowbite-react"
import React, { useState } from "react"
import {
	HiInformationCircle,
	HiOutlineEyeOff,
	HiOutlineEye,
	HiCheck,
	HiOutlineX,
} from "react-icons/hi"
import { RiFileCopyLine, RiLockPasswordFill } from "react-icons/ri"

interface Props {
	verifyStrength?: boolean
	className?: string
	password: string
	setPassword: (password: string) => void
	showPlaceholder?: boolean
	required?: boolean
}
type PasswordInputProps =
	| (Props & { id: string; label: string })
	| (Props & { id?: never; label?: never })

const specialChars = "!@#$%^&*()-_=+{};:,<.>/?~`£€[]\\|\"'"
const regexSpecialCharacters = specialChars
	.replace(/\\/g, "\\\\")
	.replace(/]/, "\\]")
	.replace(/-/g, "\\-")
	.replace(/\//g, "\\/")

const regexCommonPattern = `A-Za-z0-9\\s${regexSpecialCharacters}`

const checkLength = (password: string) => {
	return password.length >= 15 && password.length <= 50
}

const checkSpace = (password: string) => {
	const regex = /^\S*$/gm
	return regex.test(password)
}

const checkUppercaseLetters = (password: string) => {
	const regex = new RegExp(
		`^(?=(?:.*[A-Z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
		"g",
	)
	return regex.test(password)
}

const checkLowercaseLetters = (password: string) => {
	const regex = new RegExp(
		`^(?=(?:.*[a-z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
		"g",
	)
	return regex.test(password)
}

const checkNumbers = (password: string) => {
	const regex = new RegExp(
		`^(?=(?:.*[0-9]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
		"g",
	)
	return regex.test(password)
}

const checkSpecialChars = (password: string) => {
	const regex = new RegExp(
		`^(?=(?:.*[${regexSpecialCharacters}]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
		"g",
	)
	return regex.test(password)
}

export const checkPassword = (password: string) => {
	return (
		checkLength(password) &&
		checkSpace(password) &&
		checkUppercaseLetters(password) &&
		checkLowercaseLetters(password) &&
		checkNumbers(password) &&
		checkSpecialChars(password)
	)
}

const booleanToNumber = (bool: boolean) => {
	if (bool) return 1
	return 0
}

const generatePassword = (length: number): string => {
	let result = ""
	const uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const lowercaseCharacters = "abcdefghijklmnopqrstuvwxyz"
	const numbers = "0123456789"
	const specialCharacters = specialChars
	const counterCharacters = [0, 0, 0, 0]

	const generateChar = (charSet: string, lastChar: string) => {
		const cleanCharSet = charSet.replace(lastChar, "")
		return cleanCharSet[Math.floor(Math.random() * cleanCharSet.length)]
	}

	const generateIndex = () => {
		if (result.length >= length - 8) {
			for (let i = 0; i < counterCharacters.length; i++) {
				if (counterCharacters[i] < 2) {
					return i
				}
			}
		}
		return Math.floor(Math.random() * 4)
	}

	while (result.length < length) {
		const index = generateIndex()
		const charSet = [
			uppercaseCharacters,
			lowercaseCharacters,
			numbers,
			specialCharacters,
		][index]
		const char = generateChar(charSet, result[result.length - 1])

		counterCharacters[index]++
		result += char
	}

	return result
}

function PasswordProgress({ password }: Readonly<{ password: string }>) {
	const getColorFromScore = (score: number) => {
		if (score >= 6) {
			return "bg-green-500"
		}
		if (score >= 3) {
			return "bg-yellow-300 dark:bg-yellow-400"
		}
		return "bg-red-600 dark:bg-red-500"
	}

	const getPasswordScore = (password: string) => {
		if (password.length === 0) {
			return 0
		}

		const score =
			booleanToNumber(checkLength(password)) +
			booleanToNumber(checkSpace(password)) +
			booleanToNumber(checkUppercaseLetters(password)) +
			booleanToNumber(checkLowercaseLetters(password)) +
			booleanToNumber(checkNumbers(password)) +
			booleanToNumber(checkSpecialChars(password))

		return score
	}
	const score = getPasswordScore(password)
	const color = getColorFromScore(score)
	return (
		<div className="w-full bg-neutral-300 dark:bg-neutral-700 mt-2 relative h-1">
			<div
				className={`absolute left-0 top-0 h-full transition-width duration-200 
					${color}`}
				style={{ width: `${(score / 6) * 100}%` }}
			/>
		</div>
	)
}

interface PasswordReqisiteProps {
	check: boolean
	text: string
}

function PasswordRequisite({ check, text }: Readonly<PasswordReqisiteProps>) {
	return (
		<li className="flex gap-2">
			<span>
				{check ? (
					<HiCheck className="inline-block text-green-500" />
				) : (
					<HiOutlineX className="inline-block text-red-600 dark:text-red-500" />
				)}
			</span>
			<span>{text} </span>
		</li>
	)
}

function PasswordInput({
	verifyStrength = false,
	className,
	password,
	setPassword,
	showPlaceholder,
	id,
	label,
	required = false,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [showInfo, setShowInfo] = useState(false)

	return (
		<>
			<div className="w-full ">
				{label && <label htmlFor={id}>{label}</label>}
				<div
					className={`w-full relative${verifyStrength ? " grid grid-cols-[1fr_auto] gap-4" : ""}`}
				>
					<div className="relative">
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder={showPlaceholder ? "Password" : ""}
								className={`w-full ${className ?? ""}`}
								value={password}
								required={required}
								onChange={(e) => setPassword(e.target.value)}
								id={id}
								minLength={15}
								maxLength={50}
							/>
							<div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
								{verifyStrength && (
									<Tooltip content="Requisiti password">
										<button
											type="button"
											className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
											onClick={() => setShowInfo(!showInfo)}
										>
											<HiInformationCircle />
										</button>
									</Tooltip>
								)}
								<Tooltip
									content={
										showPassword ? "Nascondi password" : "Mostra password"
									}
								>
									<button
										type="button"
										className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl"
										onClick={() => {
											if (password.length <= 50) {
												setShowPassword((p) => !p)
											}
										}}
										aria-label={
											showPassword ? "Nascondi password" : "Mostra password"
										}
										data-testid="password-visibility-toggle"
									>
										{showPassword ? (
											<HiOutlineEyeOff name="Nascondi password" />
										) : (
											<HiOutlineEye name="Mostra password" />
										)}
									</button>
								</Tooltip>
							</div>
						</div>
						{verifyStrength && <PasswordProgress password={password} />}
					</div>
					{verifyStrength && (
						<div className="flex gap-2 items-stretch">
							<Tooltip content="Genera password">
								<button
									type="button"
									className="border-2 p-2 border-neutral-400 dark:border-neutral-600 h-full"
									aria-label="Genera password"
									onClick={() => setPassword(generatePassword(30))}
								>
									<RiLockPasswordFill />
								</button>
							</Tooltip>
							<Tooltip content="Copia password">
								<button
									type="button"
									className="border-2 p-2 border-neutral-400 dark:border-neutral-600 h-full"
									aria-label="Copia password"
									onClick={() => navigator.clipboard.writeText(password)}
								>
									<RiFileCopyLine />
								</button>
							</Tooltip>
						</div>
					)}
				</div>
			</div>
			{showInfo && verifyStrength && (
				<div className="mt-2">
					<p>La password deve rispettare tutti i seguenti criteri</p>
					<ul>
						<PasswordRequisite
							check={checkLength(password)}
							text="Deve avere una lunghezza da 15 a 50 caratteri."
						/>
						<PasswordRequisite
							check={checkSpace(password)}
							text="Non deve contenere spazi."
						/>
						<PasswordRequisite
							check={checkUppercaseLetters(password)}
							text="Deve contenere almeno 2 lettere maiuscole (non sono accettale le
							lettere accentate), ma non più di 2 uguali consecutive."
						/>
						<PasswordRequisite
							check={checkLowercaseLetters(password)}
							text="Deve contenere almeno 2 lettere miniscule (non sono accettale le
							lettere accentate), ma non più di 2 uguali consecutive."
						/>
						<PasswordRequisite
							check={checkLowercaseLetters(password)}
							text="Deve contenere almeno 2 lettere miniscule (non sono accettale le
							lettere accentate), ma non più di 2 uguali consecutive."
						/>
						<PasswordRequisite
							check={checkNumbers(password)}
							text="Deve contenere almeno 2 numeri, ma non più di 2 uguali."
						/>
						<PasswordRequisite
							check={checkSpecialChars(password)}
							text={`Deve contenere almeno 2 caratteri speciali( ${specialChars} ), ma
							non più di 2 uguali consecutivi tra loro.`}
						/>
					</ul>
				</div>
			)}
		</>
	)
}

export default PasswordInput
