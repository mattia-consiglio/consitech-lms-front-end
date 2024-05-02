import React from 'react'

export default function Subheader({ title }: { title: string }) {
	return (
		<div className='w-full py-4 text-center bg-neutral-800 dark:bg-neutral-300 text-neutral-50 dark:text-neutral-800'>
			<h1 className='text-3xl font-bold'>{title}</h1>
		</div>
	)
}
