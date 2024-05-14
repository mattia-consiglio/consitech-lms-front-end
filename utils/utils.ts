import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const goBackAndReload = (router: AppRouterInstance) => {
	const previousPath = localStorage.getItem('previousPath')
	if (previousPath) {
		localStorage.removeItem('previousPath')
		router.push(previousPath)
	} else {
		router.back()
	}
}
