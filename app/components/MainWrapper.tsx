import React from 'react'
import Subheader from './Subheader'

interface MainWrapperProps {
	children: React.ReactNode
	subheaderTitle?: string
	className?: string
}

export default function MainWrapper({ children, subheaderTitle, className }: MainWrapperProps) {
	console.log('subheader', subheaderTitle)

	return (
		<main className={className}>
			{subheaderTitle && <Subheader title={subheaderTitle} />}
			<div
				className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'
				style={{ minWidth: 'min(700px,calc(100vw - 1rem))' }}
			>
				<div className='w-full'>{children}</div>
			</div>
		</main>
	)
}
