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
import adminStyles from '@/app/admin/styles/admin.module.scss'

export default function AdminContents({
	title,
	type,
}: {
	title: string
	type: 'course' | 'lesson'
}) {
	const [contents, setContents] = useState<Course[] | Lesson[]>([])
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedCourse, setSelectedCourse] = useState<string>('')
	const router = useRouter()
	const link = type === 'course' ? '/admin/corsi/new' : '/admin/lezioni/new'
	const contentPluralWord = type === 'course' ? 'corsi' : 'lezioni'

	const getCourses = useCallback(async () => {
		API.get<PageableContent<Course> | Course[]>(type === 'course' ? 'courses' : 'courses/list')
			.then(response => {
				if (type === 'course' && 'content' in response) setContents(response.content)
				if (type === 'lesson' && !('content' in response)) setCourses(response)
			})
			.catch(error => {
				toast.error(error.message)
			})
			.finally(() => {
				if (type === 'course') setLoading(false)
			})
	}, [type])

	const getLessons = useCallback(async () => {
		API.get<PageableContent<Lesson>>('lessons')
			.then(response => {
				setContents(response.content)
			})
			.catch(error => {
				toast.error(error.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const getSelectedCourse = useCallback(
		async (id: string) => {
			setSelectedCourse(id)
			if (id === '') return getLessons()

			setLoading(true)
			API.get<Course[]>(`lessons/course/${id}`)
				.then(response => {
					setContents(response)
				})
				.catch(error => {
					toast.error(error.message)
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[getLessons]
	)

	useEffect(() => {
		getCourses()
		if (type === 'lesson') {
			getLessons()
		}
	}, [getCourses, getLessons, type])

	return (
		<MainWrapper>
			<div className='flex gap-x-4 mb-4 pl-4'>
				<h1>{title}</h1>
				<Button theme={customButtonTheme} outline onClick={() => router.push(link)}>
					<span className='flex gap-x-2 items-center'>
						<HiOutlinePlusSm />
						Aggiungi {type === 'course' ? 'nuovo corso' : 'nuova lezione'}
					</span>
				</Button>
			</div>
			{type === 'lesson' && (
				<div>
					<label htmlFor='course'>Corso: </label>
					<select
						name=''
						id='course'
						onChange={e => getSelectedCourse(e.target.value)}
						className={adminStyles.input}
					>
						<option key='' value=''>
							Seleziona corso
						</option>
						{courses.map(course => (
							<option key={course.id} value={course.id}>
								{course.title}
							</option>
						))}
					</select>
				</div>
			)}
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
