'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { customButtonTheme, customSpinnerTheme, customTabsTheme } from '@/app/flowbite.themes'
import { API } from '@/utils/api'
import { ChangeEvent, Course, Language, PublishStatus, SEO } from '@/utils/types'
import { Button, Modal, Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import React, { Suspense, use, useCallback, useEffect, useState } from 'react'
import { HiOutlinePlusSm, HiOutlineRefresh } from 'react-icons/hi'
import SEOComponent from './SEOComponent'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import Image from 'next/image'
import toast from 'react-hot-toast'
import MediaManager from '@/app/admin/media/components/MediaManager'
import { useAppSelector } from '@/redux/store'
import { generateSlug } from '@/utils/utils'
interface AdminCourseProps {
	courseId: string
}

export default function AdminCourse({ courseId }: AdminCourseProps) {
	const [course, setCourse] = useState<Course>({} as Course)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>()
	const [openModal, setOpenModal] = useState(false)
	const [languages, setLanguages] = useState<Language[]>([])
	const { title, description, slug, publishStatus, thumbnail, displayOrder, mainLanguage } = course
	const selectedMedia = useAppSelector(state => state.media.selected)

	const getCourse = useCallback(async () => {
		if (courseId === 'new') {
			return
		}
		API.get<Course>(`courses/${courseId}`)
			.then(response => {
				setCourse(response)
			})
			.catch(error => {
				setError(error.message)
			})
	}, [courseId])

	const getLanguages = useCallback(async () => {
		API.get<Language[]>('languages')
			.then(response => {
				setLanguages(response)
			})
			.catch(error => {
				toast.error('Error retrieval languages: ' + error.message)
			})
		console.log('getLanguages')
	}, [])

	useEffect(() => {
		getLanguages()
	}, [getLanguages])

	useEffect(() => {
		getCourse()
	}, [getCourse])

	useEffect(() => {
		if (courseId === 'new' && Object.keys(course).length === 0 && languages.length) {
			setCourse({ ...course, publishStatus: PublishStatus.DRAFT, mainLanguage: languages[0] })
		}
	}, [course, courseId, languages])

	const handleChange = (e: ChangeEvent) => {
		// console.log('e.target.name', e.target.name)
		const value = e.target.value
		let key = e.target.name
		if (key.startsWith('seo.')) {
			key = e.target.name.split('.')[1]
			setCourse({
				...course,
				seo: { ...course.seo, [key]: value },
			})
		} else {
			setCourse({ ...course, [key]: value })
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setLoading(true)

		const saveCoursePromise = async () => {
			const coursePayload = {
				title,
				slug,
				description,
				publishStatus,
				thumbnailId: thumbnail ? thumbnail.id : null,
				mainLanguageId: mainLanguage.id,
			}
			console.log('coursePayload', coursePayload)
			console.log('courseId', courseId)
			if (courseId === 'new') {
				return API.post<Course>(`courses`, coursePayload)
					.then(json => {
						console.log('post', json)
						setCourse(json)
						router.push(`/admin/corsi/${json.id}`)
					})
					.catch((err: Error) => {
						throw err
					})
			} else {
				return API.put<Course>(`courses/${course.id}`, coursePayload)
					.then(json => {
						setCourse(json)
					})
					.catch((err: Error) => {
						throw err
					})
			}
		}

		const saveSeoPromise = async () => {
			const seoPayload = {
				title: course.seo.title,
				description: course.seo.description,
				ldJSON: course.seo.ldJSON,
			}
			return await API.put<SEO>(`seo/${course.seo.id}`, seoPayload)
				.then(json => {
					setCourse({ ...course, seo: json })
				})
				.catch((err: Error) => {
					throw err
				})
		}

		const saveAll = async () => {
			console.log('saveAll')
			console.log('courseId', courseId)
			if (courseId === 'new') {
				return Promise.all([saveCoursePromise()]).catch(err => {
					throw err
				})
			} else {
				return Promise.all([saveCoursePromise(), saveSeoPromise()]).catch(err => {
					throw err
				})
			}
		}
		toast
			.promise(saveAll(), {
				loading: 'Salvataggio in corso...',
				success: 'Corso salvato correttamente!',
				error: data => data.toString(),
			})
			.catch(_ => {})
			.finally(() => {
				setLoading(false)
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
								name='slug'
								value={slug}
								onChange={handleChange}
								onFocus={() => {
									!slug && setCourse({ ...course, slug: generateSlug(title) })
								}}
								className={adminStyles.input}
								id='slug'
							/>
							<Button
								type='button'
								theme={customButtonTheme}
								outline
								onClick={() => setCourse({ ...course, slug: generateSlug(title) })}
							>
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
							) : courseId !== 'new' ? (
								<p>SEO in caricamento</p>
							) : (
								<p>SEO non presente, verrà generato in automatico</p>
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
								value={publishStatus || PublishStatus.DRAFT}
							>
								{Object.values(PublishStatus).map(status => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
						<div>
							<label htmlFor='languages' className='block'>
								Lingua originale
							</label>
							<select
								name='mainLanguageId'
								id='languages'
								className={adminStyles.input}
								value={mainLanguage ? mainLanguage.id : ''}
								onChange={handleChange}
							>
								{languages.map(language => (
									<option key={language.id} value={language.id}>
										{language.language}
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
						<div>
							<Button
								theme={customButtonTheme}
								outline
								onClick={() => router.push('/admin/corsi/new')}
							>
								<span className='flex gap-x-2 items-center'>
									<HiOutlinePlusSm />
									Aggiungi nuovo corso
								</span>
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
