import { titillium_web } from '@/app/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CourseBlockProps {
	title: string
	description: string
	img: {
		src: string
		alt: string
	}
	slug: string
}

export default function CourseBlock({ title, description, img, slug }: CourseBlockProps) {
	return (
		<Link
			className='flex flex-col items-center border-3 border-transparent hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 cursor-pointer p-4 transition-colors duration-250 ease-in-out'
			href={'/corsi/' + slug}
		>
			<Image
				src={img.src}
				alt={img.alt}
				width={80}
				height={80}
				className='max-w-20 h-auto w-full object-contain'
			/>
			<h2 className={`${titillium_web.className} mb-2 mt-3`}>{title}</h2>
			<p className='text-center'>{description}</p>
		</Link>
	)
}
