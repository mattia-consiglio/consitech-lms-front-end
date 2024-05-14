'use server'
import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
	cookies().set(name, value)
}

export async function getCookie(name: string) {
	return cookies().get(name)
}

export async function removeCookie(name: string) {
	cookies().delete(name)
}
