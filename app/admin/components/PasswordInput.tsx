'use client'
import { Tooltip } from 'flowbite-react'
import React, { useState } from 'react'
import {
	HiInformationCircle,
	HiOutlineEyeOff,
	HiOutlineEye,
	HiCheck,
	HiOutlineX,
} from 'react-icons/hi'
import { RiLockPasswordFill } from 'react-icons/ri'

interface Props {
	verifyStrength?: boolean
	className?: string
	password: string
	setPassword: (password: string) => void
	showPlaceholder?: boolean
}
type PasswordInputProps =
	| (Props & { id: string; label: string })
	| (Props & { id?: never; label?: never })

const specialChars = '!@#$%^&*()-_=+{};:,<.>/?~`£€[]\\|"\''
const regexSpecialCharacters = specialChars
	.replace(']', '\\]')
	.replace('-', '\\-')
	.replace('/', '\\/')

const regexCommonPattern = `A-Za-z0-9\\s${regexSpecialCharacters}`

const checkLength = (password: string) => {
	return password.length >= 15 && password.length <= 30
}

const checkSpace = (password: string) => {
	const regex = /^\S*$/gm
	return regex.test(password)
}

const checkUppercaseLetters = (password: string) => {
	const regex = new RegExp(`^(?=(?:.*[A-Z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`, 'gm')
	return regex.test(password)
}

const checkLowercaseLetters = (password: string) => {
	const regex = new RegExp(`^(?=(?:.*[a-z]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`, 'g')
	return regex.test(password)
}

const checkNumbers = (password: string) => {
	const regex = new RegExp(`^(?=(?:.*[0-9]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`, 'gm')
	return regex.test(password)
}

const checkSpecialChars = (password: string) => {
	const regex = new RegExp(
		`^(?=(?:.*[${regexSpecialCharacters}]){2,})(?!.*(.)\\1{2})[${regexCommonPattern}]{2,}$`,
		'gm'
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

const generatePassword = (length: number) => {
	let result = ''
	const uppercaseCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const lowercaseCharacters = 'abcdefghijklmnopqrstuvwxyz'
	const numbers = '0123456789'
	const specialCharacters = specialChars
	const characters = [uppercaseCharacters, lowercaseCharacters, numbers, specialCharacters]
	const counterCharacters = [0, 0, 0, 0]
	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length)
		const characterSet = characters[index]
		const char = characterSet[Math.floor(Math.random() * characterSet.length)]
		counterCharacters[index]++
		result += char
	}
	if (!checkPassword(result)) {
		return generatePassword(length)
	}
	return result
}

function PasswordInput({
	verifyStrength = false,
	className,
	password,
	setPassword,
	showPlaceholder,
	id,
	label,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [showInfo, setShowInfo] = useState(false)

	return (
		<>
			<div className='w-full '>
				{label && <label htmlFor={id}>{label}</label>}
				<div
					className={'w-full relative' + (verifyStrength ? ' grid grid-cols-[1fr_auto] gap-4' : '')}
				>
					<div className='relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							placeholder={showPlaceholder ? 'Password' : ''}
							className={'w-full ' + (className ?? '')}
							value={password}
							required
							onChange={e => setPassword(e.target.value)}
							id={id}
						/>
						{verifyStrength && (
							<div className='absolute right-1 top-1/2 -translate-y-1/2'>
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
						)}
						<div
							className={
								'absolute top-1/2 -translate-y-1/2 ' + (verifyStrength ? 'right-6' : 'right-1')
							}
						>
							<Tooltip content={showPassword ? 'Nascondi password' : 'Mostra password'}>
								<button
									type='button'
									className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl'
									onClick={() => setShowPassword(p => !p)}
								>
									{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
								</button>
							</Tooltip>
						</div>
					</div>
					{verifyStrength && (
						<button
							type='button'
							className='border-2 p-2'
							aria-label='Genera password'
							onClick={() => setPassword(generatePassword(30))}
						>
							<RiLockPasswordFill />
						</button>
					)}
				</div>
			</div>
			{showInfo && verifyStrength && (
				<div className='mt-2'>
					<p>La password deve rispettare tutti i seguenti criteri</p>
					<ul>
						<li>
							{checkLength(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Deve avere una lunghezza da 15 a 50 caratteri.
						</li>
						<li>
							{checkSpace(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Non deve contenere spazi.
						</li>
						<li>
							{checkUppercaseLetters(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Deve contenere almeno 2 lettere maiuscole (non sono accettale le lettere accentate),
							ma non più di 2 uguali consecutive.
						</li>
						<li>
							{checkLowercaseLetters(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Deve contenere almeno 2 lettere miniscule (non sono accettale le lettere accentate),
							ma non più di 2 uguali consecutive.
						</li>
						<li>
							{checkNumbers(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Deve contenere almeno 2 numeri, ma non più di 2 uguali.
						</li>
						<li>
							{checkSpecialChars(password) ? (
								<HiCheck className='inline-block text-green-500' />
							) : (
								<HiOutlineX className='inline-block text-red-600 dark:text-red-500' />
							)}{' '}
							Deve contenere almeno 2 caratteri speciali( {specialChars} ), ma non più di 2 uguali
							consecutivi tra loro.
						</li>
					</ul>
				</div>
			)}
		</>
	)
}

export default PasswordInput
