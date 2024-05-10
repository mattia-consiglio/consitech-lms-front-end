import { titillium_web } from '@/app/fonts'
import { Media } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CourseBlockProps {
	title: string
	description: string
	img: Media | null
	slug: string
	displayOrder: number
}

/**
 * Renders a course block component with an image, title, and description.
 *
 * @param title - The title of the course.
 * @param description - The description of the course.
 * @param img - An object containing the source and alt text for the course image.
 * @param slug - The URL slug for the course.
 * @returns A React component that renders a course block.
 */
export default function CourseBlock({
	title,
	description,
	img,
	slug,
	displayOrder,
}: CourseBlockProps) {
	return (
		<Link
			className='flex flex-col items-center border-3 border-transparent hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 cursor-pointer p-4 transition-colors duration-250 ease-in-out'
			href={'/corsi/' + slug}
		>
			{img === null ? (
				<div className='w-[100px] h-[100px] bg-primary flex justify-center items-center text-2xl font-bold'>
					<span>{displayOrder}</span>
				</div>
			) : (
				<Image
					src={img.url}
					alt={img.alt}
					width={img.width}
					height={img.height}
					className='max-w-20 h-auto w-full object-contain'
				/>
			)}
			<h2 className={`${titillium_web.className} mb-2 mt-3`}>{title}</h2>
			<p className='text-center'>{description}</p>
		</Link>
	)
}
