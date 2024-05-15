import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { JWT } from './types'

export const goBackAndReload = (router: AppRouterInstance) => {
	const previousPath = localStorage.getItem('previousPath')
	if (previousPath) {
		localStorage.removeItem('previousPath')
		router.push(previousPath)
	} else {
		router.back()
	}
}

export const parseJwt = (token: string): JWT => {
	return JSON.parse(atob(token.split('.')[1]))
}
