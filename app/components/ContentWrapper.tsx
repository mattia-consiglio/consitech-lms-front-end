import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'flowbite-react'
import { HiHome } from 'react-icons/hi'
import { BreadcrumbItemProp } from './MainWrapper'

interface ConentWrapperProps {
	children: React.ReactNode
}

export default function ContentWrapper({ children }: ConentWrapperProps) {
	return (
		<div
			className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'
			style={{ minWidth: 'min(700px,calc(100svw - 1rem))' }}
		>
			<div className='w-full'>{children}</div>
		</div>
	)
}
