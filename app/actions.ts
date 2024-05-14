'use server'
import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string, expiresIn = 1000 * 60 * 60) {
	cookies().set(name, value, { expires: new Date(Date.now() + expiresIn) })
}

export async function getCookie(name: string) {
	return cookies().get(name)
}

export async function removeCookie(name: string) {
	cookies().delete(name)
}
