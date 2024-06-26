import React from 'react'
import Subheader from './Subheader'
import { Breadcrumb, BreadcrumbItem } from 'flowbite-react'
import { HiHome } from 'react-icons/hi'
import { IconType } from 'react-icons/lib'
import ContentWrapper from './ContentWrapper'

export interface BreadcrumbItemProp {
	label: string
	href?: string
	icon?: IconType
}
interface MainWrapperProps {
	children: React.ReactNode
	subheaderTitle?: string
	className?: string
	breadcrumbItems?: BreadcrumbItemProp[]
}

export default function MainWrapper({
	children,
	subheaderTitle,
	className,
	breadcrumbItems,
}: MainWrapperProps) {
	return (
		<main className={className}>
			{subheaderTitle && <Subheader title={subheaderTitle} breadcrumbItems={breadcrumbItems} />}
			<ContentWrapper>{children}</ContentWrapper>
		</main>
	)
}
