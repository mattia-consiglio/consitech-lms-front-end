import { Media } from '@/utils/types'
import React from 'react'
import Image from 'next/image'

function MediaElement({
	m,
	selected,
	handleSelect,
}: {
	m: Media
	selected: Media | null
	handleSelect: (m: Media) => void
}) {
	return (
		<div
			key={m.id}
			className={`flex border-4 hover:border-neutral-500 bg-neutral-200 dark:bg-neutral-300 w-[200px] aspect-square max-w-full h-auto items-center justify-center group-[radio]-checked:border-primary p-2
											${selected && m.id === selected.id && ' border-primary hover:border-primary_darker'}`}
			onClick={() => handleSelect(m)}
		>
			{m.type === 'IMAGE' && <Image width={200} height={200} alt={m.alt || ''} src={m.url} />}
		</div>
	)
}

export default MediaElement
