import { titillium_web } from '@/app/fonts'
import { Media } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoCaretForward } from 'react-icons/io5'

interface LessonBlockProps {
	title: string
	description: string
	img: Media | null
	lessonSlug: string
	couseSlug: string
	displayOrder: number
}

/**
 * Renders a lesson block component that displays information about a lesson, including the lesson title, description, and an image.
 * The component is wrapped in a link that navigates to the lesson page when clicked.
 *
 * @param title - The title of the lesson.
 * @param description - The description of the lesson.
 * @param img - An object containing the source and alt text of the lesson image.
 * @param lessonSlug - The slug of the lesson.
 * @param couseSlug - The slug of the course.
 * @returns A React component that renders the lesson block.
 */
export default function LessonBlock({
	title,
	description,
	img,
	lessonSlug,
	couseSlug,
	displayOrder,
}: LessonBlockProps) {
	return (
		<Link
			href={'/corsi/' + couseSlug + '/lezione/' + lessonSlug}
			className='group flex items-center justify-between border-b-2 border-transparent border-neutral-500 hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 cursor-pointer p-4 transition-colors duration-250 ease-in-out'
		>
			<div className='flex items-center'>
				{img === null ? (
					<div className='w-[90px] h-[90px] bg-primary flex justify-center items-center text-xl font-bold'>
						<span>{displayOrder}</span>
					</div>
				) : (
					<Image
						src={img.url}
						alt={img.alt}
						width={img.width}
						height={img.height}
						className='max-w-24 h-auto w-full object-contain'
					/>
				)}
				<div className='ml-4'>
					<h2 className={`${titillium_web.className}`}>{title}</h2>
					<p className='text-neutral-500 dark:text-neutral-400'>{description}</p>
				</div>
			</div>
			<div className='flex'>
				<IoCaretForward
					data-testid='caret-forward-icon'
					className='text-2xl grow min-w-[24px] group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors duration-250 ease-in-out'
				/>
			</div>
		</Link>
	)
}
