'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { API } from '@/utils/api'
import { Course, Lesson, PageableContent, UserRole } from '@/utils/types'
import { Button } from 'flowbite-react'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import AdminContentBlock from './AdminContentBlock'
import { customButtonTheme } from '@/app/flowbite.themes'
import { HiOutlinePlusSm } from 'react-icons/hi'
import { error } from 'console'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminContents({
	title,
	type,
}: {
	title: string
	type: 'course' | 'lesson'
}) {
	const [contents, setContents] = useState<Course[] | Lesson[]>([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const link = type === 'course' ? '/admin/corsi/new' : '/admin/lezioni/new'
	const contentPluralWord = type === 'course' ? 'corsi' : 'lezioni'

	const getCourses = useCallback(async () => {
		API.get<PageableContent<Course>>(type === 'course' ? 'courses' : 'lessons')
			.then(response => {
				setContents(response.content)
			})
			.catch(error => {
				toast.error(error.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [type])

	useEffect(() => {
		getCourses()
	}, [getCourses])

	return (
		<MainWrapper>
			<div className='flex gap-x-4 mb-4 pl-4'>
				<h1>{title}</h1>
				<Button theme={customButtonTheme} outline onClick={() => router.push(link)}>
					<span className='flex gap-x-2 items-center'>
						<HiOutlinePlusSm />
						Aggiungi nuovo corso
					</span>
				</Button>
			</div>
			<div>
				{loading && <div>Caricamento...</div>}
				{!loading && !contents.length && <p>Non ci sono {contentPluralWord}.</p>}
				{!loading &&
					contents.length > 0 &&
					contents.map(course => (
						<AdminContentBlock key={course.id} type={type} content={course} />
					))}
			</div>
		</MainWrapper>
	)
}
