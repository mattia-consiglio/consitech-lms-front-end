'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

export default function PathName() {
	const pathname = usePathname()

	useEffect(() => {
		localStorage.setItem('previousPath', pathname)
	}, [pathname])

	return <></>
}
