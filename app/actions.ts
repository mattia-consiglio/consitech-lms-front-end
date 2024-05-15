'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setCookie(name: string, value: string, expiresIn = 1000 * 60 * 60) {
	const expires = new Date(Date.now() + expiresIn)
	cookies().set(name, value, { expires })
}

export async function getCookie(name: string) {
	return cookies().get(name)
}

export async function removeCookie(name: string) {
	cookies().delete(name)
}

export async function getAuthAndRedirectLogin() {
	const token = await getCookie('token')
	if (!token) {
		return redirect('/login-register')
	}
}
