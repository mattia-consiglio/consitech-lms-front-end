import React from 'react'
import { titillium_web } from '../fonts'
import { BreadcrumbItemProp } from './MainWrapper'
import { Breadcrumb, BreadcrumbItem } from 'flowbite-react'
import { customBreadcrumbTheme } from '../flowbite.themes'

interface SubheaderProps {
	title: string
	breadcrumbItems?: BreadcrumbItemProp[]
}

export default function Subheader({ title, breadcrumbItems }: Readonly<SubheaderProps>) {
	return (
		<div className='w-full py-4 text-center bg-neutral-800 dark:bg-neutral-300 text-neutral-50 dark:text-neutral-800'>
			<h1 className={`${titillium_web.className} text-3xl font-bold`}>{title}</h1>
			<div className='flex justify-center mt-4'>
				{breadcrumbItems ? (
					<Breadcrumb aria-label='Breadcrumb' theme={customBreadcrumbTheme?.root}>
						{breadcrumbItems.map(item => (
							<BreadcrumbItem
								key={item.label}
								href={item.href}
								icon={item.icon}
								theme={customBreadcrumbTheme?.item}
								
							>
								{item.label}
							</BreadcrumbItem>
						))}
					</Breadcrumb>
				) : (
					''
				)}
			</div>
		</div>
	)
}
