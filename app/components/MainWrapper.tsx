import React from 'react'
import Subheader from './Subheader'

export default function MainWrapper({
	children,
	subheaderTitle,
}: {
	children: React.ReactNode
	subheaderTitle?: string
}) {
	console.log('subheader', subheaderTitle)

	return (
		<main>
			{subheaderTitle && <Subheader title={subheaderTitle} />}
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				<div className='w-full'>{children}</div>
			</div>
		</main>
	)
}
