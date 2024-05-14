'use client'
import { titillium_web } from '@/app/fonts'
import { Course, PublishStatus, UserRole } from '@/utils/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { title } from 'process'
import React from 'react'
import { HiOutlinePencil } from 'react-icons/hi'
import Image from 'next/image'

interface AdminCourseBlockProps extends Course {}

export default function AdminCourseBlock({
	title,
	description,
	slug,
	displayOrder,
	thumbnail,
	publishStatus,
	id,
}: AdminCourseBlockProps) {
	return (
		<Link
			className={`border-3 border-transparent hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 cursor-pointer p-4 transition-colors duration-250 ease-in-out relative group`}
			href={'/corsi/' + slug}
		>
			<div
				className={`flex flex-col items-center ${
					publishStatus === PublishStatus.DRAFT ? 'opacity-50' : 'opacity-100'
				}`}
			>
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
				<h2 className={`${titillium_web.className} mb-2 mt-3`}>{title}</h2>
				<p className='text-center'>{description}</p>
			</div>

			<button
				className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center  opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all duration-250 ease-in-out'
				type='button'
				aria-label='Modifica corso'
				onClick={e => {
					e.preventDefault()
					redirect('/admin/corsi/' + id)
				}}
			>
				<HiOutlinePencil />
			</button>
		</Link>
	)
}
