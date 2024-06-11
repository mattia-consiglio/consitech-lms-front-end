'use client'
import MainWrapper from '@/app/components/MainWrapper'
import { customButtonTheme, customSpinnerTheme, customTabsTheme } from '@/app/flowbite.themes'
import { API } from '@/utils/api'
import { ChangeEvent, Course, Language, Lesson, PublishStatus, SEO, SrtLine } from '@/utils/types'
import { Button, Modal, Spinner } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
import React, {
	FormEvent,
	FormEventHandler,
	Suspense,
	use,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { HiOutlinePlusSm, HiOutlineRefresh } from 'react-icons/hi'
import SEOComponent from './SEOComponent'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import Image from 'next/image'
import toast from 'react-hot-toast'
import MediaManager from '@/app/admin/media/components/MediaManager'
import { useAppSelector } from '@/redux/store'
import { generateSlug } from '@/utils/utils'
import Tiptap from './TipTap'
import { parse } from 'path'

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
					liveEditor: '',
					videoId: '',
					videoThumbnail: '',
					content: '',
					seo: {
						title: '',
						description: '',
					} as SEO,
					course: {
						id: '',
					} as Course,
			  } as Lesson & { liveEditor: string })
	)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>()
	const [openModal, setOpenModal] = useState(false)
	const [languages, setLanguages] = useState<Language[]>([])
	const [saved, setSaved] = useState(true)
	const [courses, setCourses] = useState<Course[]>([])
	const [isContentLoaded, setIsContentLoaded] = useState(false)
	const { title, description, slug, publishStatus, thumbnail, displayOrder, mainLanguage } = content
	const selectedMedia = useAppSelector(state => state.media.selected)
	const srtFileRef = useRef<HTMLInputElement>(null)

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
				setIsContentLoaded(true)
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
				return doActions()
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
		if (window) {
			window.addEventListener('beforeunload', beforeLeave)
			return () => {
				window.removeEventListener('beforeunload', beforeLeave)
			}
		}
	}, [beforeLeave])

	useEffect(() => {
		setSaved(false)
	}, [selectedMedia])

	const extractVideoId = (url: string) => {
		const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
		const match = url.match(regExp)
		return match && match[7].length === 11 ? match[7] : ''
	}

	const handleChange = (e: ChangeEvent) => {
		setSaved(false)
		let value = e.target.value
		let key = e.target.name
		if (key.startsWith('seo.')) {
			key = e.target.name.split('.')[1]
			setContent({
				...content,
				seo: { ...content.seo, [key]: value },
			})
			return
		}

		if (key === 'videoId') {
			value = extractVideoId(value)
		}

		if (key === 'course') {
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

	const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault()
		if (loading) return
		if (saved) return

		setLoading(true)

		const saveContentPromise = async () => {
			const contentPayload =
				contentType === 'corsi'
					? {
							title,
							slug,
							description,
							publishStatus,
							thumbnailId: thumbnail ? thumbnail.id : null,
							mainLanguageId: mainLanguage.id,
					  }
					: {
							title,
							slug,
							description,
							publishStatus,
							thumbnailId: thumbnail ? thumbnail.id : null,
							mainLanguageId: mainLanguage.id,
							courseId: (content as Lesson).course.id,
							liveEditor: (content as Lesson).liveEditor,
							videoId: (content as Lesson).videoId,
							videoThumbnail: (content as Lesson).videoThumbnail,
							content: (content as Lesson).content,
					  }

			console.log('contentPayload', contentPayload)
			console.log('contentId', contentId)
			if (contentId === 'new') {
				return API.post<Course>(contentType === 'corsi' ? 'courses' : 'lessons', contentPayload)
					.then(json => {
						console.log('post', json)
						setContent(json)
						if (contentType === 'corsi') {
							router.push(`/admin/corsi/${json.id}`)
						} else {
							router.push(`/admin/lezioni/${json.id}`)
						}
					})
					.catch((err: Error) => {
						throw err
					})
			} else {
				return API.put<Course>(
					`${contentType === 'corsi' ? 'courses' : 'lessons'}/${content.id}`,
					contentPayload
				)
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

	const handleKeyboardSubmit = (e: KeyboardEvent) => {
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault()

			handleSubmit()
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyboardSubmit)
		return () => {
			document.removeEventListener('keydown', handleKeyboardSubmit)
		}
	})

	const setLessonContent = (newContent: string) => {
		setSaved(false)
		setContent({ ...content, content: newContent })
	}

	const parseSrtTimeInMs = (time: string) => {
		const [hours, minutes, seconds, milliseconds] = time
			.replace(',', ':')
			.split(':')
			.map(parseFloat)
		console.log('time', time, hours, minutes, seconds, milliseconds)
		return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds
	}

	const parseSRTFile = (e: FormEvent<HTMLInputElement>) => {
		const file = (e.target as HTMLInputElement).files?.[0]
		if (!file) return
		console.log('file', file)
		const reader = new FileReader()
		reader.onload = async e => {
			e.preventDefault()
			const text = e.target?.result as string
			console.log('text', text)
			const lineBreak = /\r\n\r\n\r\n|\n\n\n|\r\n\r\n|\n\n/
			const lines = text.split(lineBreak).filter(line => line.trim() !== '')
			console.log('lines', lines)
			const srtContent: SrtLine[] = []
			lines.forEach(line => {
				const lineBreak = /\r\n|\n/
				const parts = line.split(lineBreak)
				const sequence = srtContent.length
					? srtContent[srtContent.length - 1].sequence + 1
					: parseInt(parts[0])
				const [timeStart, timeEnd] = parts[1].split(' --> ').map(parseSrtTimeInMs)
				const text = parts[2] ? parts[2] : ''
				if (text === srtContent[srtContent.length - 1]?.text) {
					srtContent[srtContent.length - 1].timeEnd = timeEnd
					return
				}
				srtContent.push({ sequence, timeStart, timeEnd, text })
			})
			console.log('content', srtContent)
			const liveEditor = JSON.stringify(srtContent)
			setContent({ ...content, liveEditor })
			if (srtFileRef.current) srtFileRef.current.value = ''
		}
		reader.readAsText(file)
	}

	return (
		<MainWrapper>
			<Suspense fallback='Caricamento...'>
				<h1 className='mb-4'>{contentType === 'corsi' ? 'Corso' : 'Lezione'}</h1>
				<form
					onSubmit={handleSubmit}
					className='w-full grid md:grid-cols-[1fr_auto] grid-cols-1 gap-4 items-start'
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
						{contentType === 'lezioni' && 'course' in content && (
							<>
								<div className=''>
									<label htmlFor='videoId'>Video id: </label>{' '}
									<input
										type='text'
										name='videoId'
										value={(content as Lesson).videoId || ''}
										onChange={handleChange}
										onFocus={() => {
											!slug && setContent({ ...content, slug: generateSlug(title) })
										}}
										className={adminStyles.input}
										id='videoId'
									/>
								</div>
								<div>
									<label htmlFor='content' className='block'>
										Lezione
									</label>
									<div>
										<label htmlFor='liveEditor' className='block'>
											Live Editor
										</label>
										<input
											type='file'
											name='liveEditorSrt'
											id='liveEditorSrt'
											onInput={e => parseSRTFile(e)}
											ref={srtFileRef}
										/>
										<textarea
											name='liveEditor'
											id='liveEditor'
											className={adminStyles.input}
											value={content.liveEditor || ''}
											onChange={handleChange}
										></textarea>
									</div>
									{isContentLoaded && (
										<Tiptap content={(content as Lesson).content} onUpdate={setLessonContent} />
									)}
								</div>
							</>
						)}
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
					<div className='gap-2 flex flex-col md:sticky md:top-[81px]'>
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
								<label htmlFor='courses'>Corso</label>
								<select
									name='course'
									id='courses'
									className={adminStyles.input}
									value={('course' in content && content.course.id) || ''}
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
									Aggiungi {contentType === 'corsi' ? 'nuovo corso' : 'nuova lezione'}
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
