'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { customButtonTheme, customSpinnerTheme, customTabsTheme } from '@/app/flowbite.themes'
import { API } from '@/utils/api'
import { ChangeEvent, Course, PublishStatus, SEO } from '@/utils/types'
import { Button, Modal, Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'
import SEOComponent from './SEOComponent'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import Image from 'next/image'
import toast from 'react-hot-toast'
import MediaManager from '@/app/admin/media/components/MediaManager'
import { useAppSelector } from '@/redux/store'
interface AdminCourseProps {
	courseId: string
}

export default function AdminCourse({ courseId }: AdminCourseProps) {
	const [course, setCourse] = useState<Course>({} as Course)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>()
	const [openModal, setOpenModal] = useState(false)
	const { title, description, slug, publishStatus, thumbnail, displayOrder } = course
	const selectedMedia = useAppSelector(state => state.media.selected)

	const getCourse = useCallback(async () => {
		if (courseId === 'new') return
		API.get<Course>(`courses/${courseId}`)
			.then(response => {
				setCourse(response)
			})
			.catch(error => {
				setError(error.message)
			})
	}, [courseId])

	useEffect(() => {
		getCourse()
	}, [getCourse])

	const handleChange = (e: ChangeEvent) => {
		console.log(e.target.name, e.target.value)
		if (e.target.name.startsWith('seo.')) {
			setCourse({
				...course,
				seo: { ...course.seo, [e.target.name.split('.')[1]]: e.target.value },
			})
		} else {
			setCourse({ ...course, [e.target.name]: e.target.value })
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const coursePayload = {
			title,
			slug,
			description,
			publishStatus,
			thumbnailId: thumbnail ? thumbnail.id : null,
		}

		const seoPayload = {
			title: course.seo.title,
			description: course.seo.description,
			ldJSON: course.seo.ldJSON,
		}

		setLoading(true)

		const saveCoursePromise = API.put<Course>(`courses/${courseId}`, coursePayload)
			.then(json => {
				setCourse(json)
			})
			.catch((err: Error) => {
				return err.message
			})

		const saveSeoPromise = API.put<SEO>(`seo/${course.seo.id}`, seoPayload)
			.then(json => {
				setCourse({ ...course, seo: json })
			})
			.catch((err: Error) => {
				return err.message
			})

		const saveAll = async () => {
			await Promise.all([saveCoursePromise, saveSeoPromise]).finally(() => {
				setLoading(false)
			})
		}

		toast.promise(saveAll(), {
			loading: 'Salvataggio in corso...',
			success: 'Corso salvato correttamente!',
			error: data => data.toString(),
		})
	}

	return (
		<MainWrapper>
			<Suspense fallback='Caricamento...'>
				<form
					onSubmit={handleSubmit}
					className='w-full grid md:grid-cols-[1fr_auto] grid-cols-1  gap-4'
				>
					{/* Col 1 */}
					<div>
						<input
							type='text'
							name='title'
							value={title}
							onChange={handleChange}
							className={adminStyles.input + ' mb-2'}
						/>
						<div className='flex justify-between items-center gap-4 mb-4'>
							<label htmlFor='slug'>Slug: </label>{' '}
							<input
								type='text'
								value={slug}
								onChange={handleChange}
								className={adminStyles.input}
								id='slug'
							/>
							<Button type='button' theme={customButtonTheme} outline>
								<HiOutlineRefresh />
							</Button>
						</div>
						<div>
							<label htmlFor='description' className='block'>
								Descrizione
							</label>
							<textarea
								name='description'
								id='description'
								className={adminStyles.input}
								value={description}
								onChange={handleChange}
							></textarea>
						</div>
						<div>
							{'seo' in course ? (
								<SEOComponent content={course} handleChange={handleChange} />
							) : (
								<p>SEO in caricamento</p>
							)}
						</div>
					</div>
					{/* Col 2 */}
					<div className='gap-2 flex flex-col'>
						<div>
							<label htmlFor='publishStatus' className='block'>
								Stato pubblicazione
							</label>
							<select
								name='publishStatus'
								id='publishStatus'
								onChange={handleChange}
								className={adminStyles.input}
							>
								{Object.values(PublishStatus).map(status => (
									<option
										key={status}
										value={status}
										selected={publishStatus === status || status === PublishStatus.DRAFT}
										className={adminStyles.input}
									>
										{status}
									</option>
								))}
							</select>
						</div>
						<button
							type='button'
							className='flex justify-center'
							onClick={() => setOpenModal(true)}
						>
							{thumbnail === null || thumbnail === undefined ? (
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
						</button>
						<div>
							<Button
								type='submit'
								theme={customButtonTheme}
								outline
								fullSized
								disabled={loading || (!title && !slug && !description)}
							>
								<div className='flex justify-around items-center w-full'>
									{loading && <Spinner theme={customSpinnerTheme} color='primary' />} Salva
								</div>
							</Button>
						</div>
					</div>
				</form>
			</Suspense>
			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>Media</Modal.Header>
				<Modal.Body>
					<MediaManager displayTitle={false} />
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={() => {
							setOpenModal(false)
							setCourse({ ...course, thumbnail: selectedMedia })
						}}
						outline
						theme={customButtonTheme}
					>
						Seleziona
					</Button>
					<Button
						color='gray'
						onClick={() => setOpenModal(false)}
						outline
						theme={customButtonTheme}
					>
						Annulla
					</Button>
				</Modal.Footer>
			</Modal>
		</MainWrapper>
	)
}
