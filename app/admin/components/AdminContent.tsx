'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { customButtonTheme, customSpinnerTheme, customTabsTheme } from '@/app/flowbite.themes'
import { API } from '@/utils/api'
import { ChangeEvent, Course, Language, Lesson, PublishStatus, SEO } from '@/utils/types'
import { Button, Modal, Spinner } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
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
	contentId: string
}

export default function AdminContent({ contentId }: AdminCourseProps) {
	const pathname = usePathname()
	const contentType: 'corsi' | 'lezioni' = pathname.split('/')[2] as 'corsi' | 'lezioni'
	const [content, setContent] = useState<Course | Lesson>(
		contentType === 'corsi'
			? ({
					title: '',
					description: '',
					slug: '',
					publishStatus: PublishStatus.DRAFT,
					thumbnail: null,
					displayOrder: 0,
					mainLanguage: {} as Language,
					seo: {
						title: '',
						description: '',
					} as SEO,
					enrolledStudents: 0,
			  } as Course)
			: ({
					title: '',
					description: '',
					slug: '',
					publishStatus: PublishStatus.DRAFT,
					thumbnail: null,
					displayOrder: 0,
					mainLanguage: {} as Language,
					seo: {
						title: '',
						description: '',
					} as SEO,
					course: {
						id: '',
					} as Course,
			  } as Lesson)
	)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>()
	const [openModal, setOpenModal] = useState(false)
	const [languages, setLanguages] = useState<Language[]>([])
	const [saved, setSaved] = useState(true)
	const [courses, setCourses] = useState<Course[]>([])
	const { title, description, slug, publishStatus, thumbnail, displayOrder, mainLanguage } = content
	const selectedMedia = useAppSelector(state => state.media.selected)

	const getContent = useCallback(async () => {
		if (contentId === 'new') {
			return
		}
		API.get<Course | Lesson>(
			contentType === 'corsi' ? `courses/${contentId}` : `lessons/${contentId}`
		)
			.then(response => {
				setContent(response)
			})
			.catch(error => {
				setError(error.message)
			})
	}, [contentId, contentType])

	const getLanguages = useCallback(async () => {
		API.get<Language[]>('languages')
			.then(response => {
				setLanguages(response)
			})
			.catch(error => {
				toast.error('Error retrieval languages: ' + error.message)
			})
	}, [])

	const getCourses = useCallback(async () => {
		API.get<Course[]>('courses/list')
			.then(response => {
				setCourses(response)
			})
			.catch(error => {
				toast.error('Error retrieval courses: ' + error.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const beforeLeave = useCallback(
		(e?: BeforeUnloadEvent) => {
			const doActions = () => {
				if (e) {
					window.close()
				} else {
					if (contentType === 'corsi') {
						router.push(`/admin/corsi/new`)
					} else {
						router.push(`/admin/lezioni/new`)
					}
				}
			}

			if (saved) {
				doActions()
			}

			if (e) {
				e.preventDefault()
			}

			if (window.confirm('Ci sono modifiche non salvate. Continuare?')) {
				doActions()
			}
		},
		[contentType, router, saved]
	)

	useEffect(() => {
		getLanguages()
	}, [getLanguages])

	useEffect(() => {
		getContent()
	}, [getContent])

	useEffect(() => {
		getCourses()
	}, [getCourses])

	useEffect(() => {
		if (contentId === 'new' && Object.keys(content.mainLanguage).length === 0 && languages.length) {
			setSaved(false)
			setContent({ ...content, publishStatus: PublishStatus.DRAFT, mainLanguage: languages[0] })
		}
	}, [content, contentId, languages])

	useEffect(() => {
		window.addEventListener('beforeunload', beforeLeave)
		return () => {
			window.removeEventListener('beforeunload', beforeLeave)
		}
	}, [beforeLeave])

	const handleChange = (e: ChangeEvent) => {
		setSaved(false)
		const value = e.target.value
		let key = e.target.name
		if (key.startsWith('seo.')) {
			key = e.target.name.split('.')[1]
			setContent({
				...content,
				seo: { ...content.seo, [key]: value },
			})
			return
		}

		if (key === 'course' && 'course' in content) {
			const course = courses.find(c => c.id === value) as Course
			console.log('course', course)
			setContent({
				...content,
				course: course,
			})
			return
		}
		setContent({ ...content, [key]: value })
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setLoading(true)

		const saveContentPromise = async () => {
			const coursePayload = {
				title,
				slug,
				description,
				publishStatus,
				thumbnailId: thumbnail ? thumbnail.id : null,
				mainLanguageId: mainLanguage.id,
			}
			console.log('coursePayload', coursePayload)
			console.log('courseId', contentId)
			if (contentId === 'new') {
				return API.post<Course>(`courses`, coursePayload)
					.then(json => {
						console.log('post', json)
						setContent(json)
						router.push(`/admin/corsi/${json.id}`)
					})
					.catch((err: Error) => {
						throw err
					})
			} else {
				return API.put<Course>(`courses/${content.id}`, coursePayload)
					.then(json => {
						setContent(json)
					})
					.catch((err: Error) => {
						throw err
					})
			}
		}

		const saveSeoPromise = async () => {
			const seoPayload = {
				title: content.seo.title,
				description: content.seo.description,
				ldJSON: content.seo.ldJSON,
			}
			return await API.put<SEO>(`seo/${content.seo.id}`, seoPayload)
				.then(json => {
					setContent({ ...content, seo: json })
				})
				.catch((err: Error) => {
					throw err
				})
		}

		const saveAll = async () => {
			console.log('saveAll')
			console.log('courseId', contentId)
			if (contentId === 'new') {
				return Promise.all([saveContentPromise()])
					.then(() => {
						setSaved(true)
					})
					.catch(err => {
						throw err
					})
			} else {
				return Promise.all([saveContentPromise(), saveSeoPromise()])
					.then(() => {
						setSaved(true)
					})
					.catch(err => {
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
				<h1 className='mb-4'>{contentType === 'corsi' ? 'Corso' : 'Lezione'}</h1>
				<form
					onSubmit={handleSubmit}
					className='w-full grid md:grid-cols-[1fr_auto] grid-cols-1  gap-4'
				>
					{/* Col 1 */}
					<div>
						<input
							type='text'
							name='title'
							value={title || ''}
							onChange={handleChange}
							className={adminStyles.input + ' mb-2'}
						/>
						<div className='flex justify-between items-center gap-4 mb-4'>
							<label htmlFor='slug'>Slug: </label>{' '}
							<input
								type='text'
								name='slug'
								value={slug || ''}
								onChange={handleChange}
								onFocus={() => {
									!slug && setContent({ ...content, slug: generateSlug(title) })
								}}
								className={adminStyles.input}
								id='slug'
							/>
							<Button
								type='button'
								theme={customButtonTheme}
								outline
								onClick={() => setContent({ ...content, slug: generateSlug(title) })}
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
								value={description || ''}
								onChange={handleChange}
							></textarea>
						</div>
						<div>
							{'seo' in content ? (
								<SEOComponent content={content} handleChange={handleChange} />
							) : contentId !== 'new' ? (
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
						{contentType === 'lezioni' && (
							<div>
								<label htmlFor='courses'>Corsi</label>
								<select
									name='course'
									id='courses'
									className={adminStyles.input}
									value={
										('course' in content && content.course.id) ||
										// courses.find(c => 'course' in content && c.id === content.course.id)?.id ||
										''
									}
									onChange={handleChange}
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
								disabled={
									loading ||
									!title ||
									!slug ||
									(description.length < 20 && description.length > 100) ||
									saved
								}
							>
								<div className='flex justify-around items-center w-full'>
									{loading && <Spinner theme={customSpinnerTheme} color='primary' />} Salva
								</div>
							</Button>
						</div>
						<div>
							<Button theme={customButtonTheme} outline onClick={() => beforeLeave()}>
								<span className='flex gap-x-2 items-center'>
									<HiOutlinePlusSm />
									Aggiungi nuovo {contentType === 'corsi' ? 'corso' : 'lezione'}
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
							setContent({ ...content, thumbnail: selectedMedia })
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
