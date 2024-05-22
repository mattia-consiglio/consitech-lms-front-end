'use client'
import { titillium_web } from '@/app/fonts'
import { AbstractContent, Course, Lesson } from '@/utils/types'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

interface AdminContentBlockProps {
	type: 'course' | 'lesson'
	content: Course | Lesson
}

export default function AdminContentBlock({ content, type }: AdminContentBlockProps) {
	const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault()
	}

	const { title, description, displayOrder, thumbnail, publishStatus, id } = content

	const link = type === 'course' ? `/admin/corsi/${id}` : `/admin/lezioni/${id}`
	return (
		<div
			className={`border-3 border-transparent hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 p-4 transition-colors duration-250 ease-in-out relative group`}
		>
			<div className={`grid grid-cols-1 md:grid-cols-[100px_1fr_auto] items-center`}>
				{thumbnail === null ? (
					<div className='w-[100px] h-[100px] bg-primary flex justify-center items-center text-2xl font-bold'>
						<span>{displayOrder}</span>
					</div>
				) : (
					<Image
						src={thumbnail.url}
						alt={thumbnail.alt}
						width={thumbnail.width}
						height={thumbnail.height}
						className='max-w-20 h-auto w-full object-contain'
					/>
				)}
				<div className='ml-4'>
					<div className='pl-2'>
						<h2 className={`${titillium_web.className} mb-2 mt-3`}>{title}</h2>
						<p>{description}</p>
					</div>
					<p className='mt-2 opacity-0 group-hover:opacity-100'>
						<Link
							href={link}
							className='hover:bg-primary focus-within:bg-primary hover:text-white  py-1 px-2'
						>
							Modifica
						</Link>{' '}
						-{' '}
						<a
							href='#'
							onClick={handleDelete}
							className='hover:bg-red-600 focus-within:bg-red-600 hover:text-white focus-within:text-white py-1 px-2	'
						>
							Cestina
						</a>
					</p>
				</div>
				<div className='flex-grow flex flex-col items-end justify-end'>
					<p>Stato</p>
					<p>{publishStatus}</p>
				</div>
			</div>
		</div>
	)
}
