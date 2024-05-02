import { titillium_web } from '@/app/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoCaretForward } from 'react-icons/io5'

interface LessonBlockProps {
	title: string
	description: string
	img: {
		src: string
		alt: string
	}
	lessonSlug: string
	couseSlug: string
}

export default function LessonBlock({
	title,
	description,
	img,
	lessonSlug,
	couseSlug,
}: LessonBlockProps) {
	return (
		<Link
			href={'/corsi/' + couseSlug + '/lezione/' + lessonSlug}
			className='group flex items-center border-b-2 border-transparent border-neutral-500 hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 cursor-pointer p-4 transition-colors duration-250 ease-in-out'
		>
			<Image
				src={img.src}
				alt={img.alt}
				width={90}
				height={90}
				className='max-w-24 h-auto w-full object-contain'
			/>
			<div className='ml-4'>
				<h2 className={`${titillium_web.className}`}>{title}</h2>
				<p className='text-neutral-500 dark:text-neutral-400'>{description}</p>
			</div>
			<IoCaretForward className='text-2xl grow min-w-[24px] group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors duration-250 ease-in-out' />
		</Link>
	)
}
