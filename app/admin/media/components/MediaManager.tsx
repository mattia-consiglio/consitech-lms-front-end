'use client'
import { setSelectedMedia, setSelectedMediaAlt } from '@/redux/reducers/mediaReducer'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { API } from '@/utils/api'
import { Media, PageableContent, MediaImage, MediaVideo, MediaType } from '@/utils/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import toast from 'react-hot-toast'
import { Button } from 'flowbite-react'
import { HiOutlineTrash } from 'react-icons/hi'
import { FaRotate } from 'react-icons/fa6'
import { customButtonTheme } from '@/app/flowbite.themes'
import MediaElements from './MediaElements'
import { formatTime } from '@/app/corsi/[course_slug]/lezione/[lesson_slug]/VideoControls'

interface MediaManagerProps {
	displayTitle?: boolean
	mediaType?: MediaType
}

export default function MediaManager({ displayTitle = true, mediaType }: MediaManagerProps) {
	const selected = useAppSelector(state => state.media.selected)
	const dispatch = useAppDispatch()
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')
	const [media, setMedia] = useState<PageableContent<Media>>({} as PageableContent<Media>)
	const fileRef = useRef<HTMLInputElement>(null)

	const fetchMedia = useCallback(async () => {
		const endpoint = mediaType ? 'media?type=' + mediaType : 'media'
		setLoading(true)
		try {
			const response = await API.get<PageableContent<Media>>(endpoint)
			setMedia(response)
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [mediaType])

	const handleDelete = (media: Media | null) => {
		if (!media) return
		const confirm = window.confirm('Sei sicuro di voler eliminare questo media?')
		if (confirm) {
			setLoading(true)
			API.delete(`media/${media.id}`)
				.then(() => {
					toast.success('Media eliminato con successo')
					fetchMedia()
					dispatch(setSelectedMedia(null))
					setSearch('')
					setError('')
				})
				.catch(error => {
					toast.error(error.message)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	const handleUpload = async (e: React.FormEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (!e.currentTarget.files) {
			return
		}
		setLoading(true)
		setError('')
		const formData = new FormData()
		formData.append('thumbnail', e.currentTarget.files[0])
		API.post<Media>('media/upload', formData, null)
			.then(response => {
				toast.success('Media caricato con successo')
				setMedia({ ...media, content: [response, ...media.content] })
				dispatch(setSelectedMedia(response))
				setSearch('')
			})
			.catch(error => {
				toast.error(error.message)
			})
			.finally(() => {
				setLoading(false)
				if (fileRef.current) fileRef.current.value = ''
			})
	}

	const handleUpdate = (m: Media | null) => {
		if (!m || !m.alt) {
			return
		}

		API.put<Media>(`media/${m.id}`, {
			alt: m.alt === null ? '' : m.alt,
		})
			.then(() => {
				toast.success('Media aggiornato con successo')
				const newMedia = media.content.map((media: Media) => {
					if (m.id === media.id) {
						return m
					}
					return media
				})
				setMedia({ ...media, content: newMedia })
				setError('')
			})
			.catch((error: Error) => {
				toast.error(error.message)
				setError(error.message)
			})
	}

	useEffect(() => {
		fetchMedia()
	}, [fetchMedia])

	return (
		<>
			<div>
				<div className='flex gap-4 mb-4'>
					{displayTitle && <h1>Media manager</h1>}
					<Button theme={customButtonTheme} outline onClick={() => fetchMedia()}>
						<FaRotate />
					</Button>
				</div>
				<Button as='label' theme={customButtonTheme} outline htmlFor='file'>
					Carica media
				</Button>
				<input
					type='file'
					name='file'
					id='file'
					className='hidden'
					onInput={e => handleUpload(e)}
					accept='image/*, video/mp4'
					multiple={false}
					ref={fileRef}
				/>
				<input
					type='search'
					name='search'
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='Cerca media'
					className={adminStyles.input + ' mb-2'}
				/>
			</div>
			<div className='w-full grid md:grid-cols-[1fr_auto] grid-cols-1 gap-4'>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{loading && (
						<div className='w-full h-full flex items-center justify-center'>Caricamento...</div>
					)}
					{error !== '' && (
						<div className='w-full h-full flex items-center justify-center'>
							C&apos;è stato un errore durante il caricamento dei media:
							<br />
							{error}
						</div>
					)}
					{!loading && error === '' && <MediaElements media={media} />}
				</div>

				<div className='md:min-w-52 md:max-w-52 md:border-l-2 border-neutral-200 dark:border-neutral-700 pl-4'>
					{selected && (
						<>
							<label htmlFor='alt'>Alt</label>
							<input
								type='text'
								name='alt'
								id='alt'
								value={selected?.alt || ''}
								onChange={e => {
									dispatch(setSelectedMediaAlt(e.target.value))
								}}
								className={adminStyles.input + ' mb-2'}
								onBlur={() => handleUpdate(selected)}
							/>
							<input
								type='text'
								name='url'
								id='url'
								value={selected?.url || ''}
								readOnly
								className={adminStyles.input + ' mb-2'}
								onFocus={e => e.target.select()}
							/>
							{selected.type === 'IMAGE' && (
								<>
									<p>
										Dimensioni (LxA): {(selected as MediaImage)?.width}x
										{(selected as MediaImage)?.height}{' '}
									</p>
									<p>Colore principale: {(selected as MediaImage)?.avgColor}</p>
								</>
							)}
							{selected.type === 'VIDEO' && (
								<>
									<p>Durata: {formatTime((selected as MediaVideo)?.duration)}</p>
									<p>
										Risoluzioni:{' '}
										{selected &&
										'resolutions' in selected &&
										selected.resolutions &&
										selected.resolutions.length
											? selected.resolutions.flatMap((resolution, index) => {
													return index < selected.resolutions.length - 1
														? resolution.name + ', '
														: resolution.name
											  })
											: 'N/A'}
									</p>
								</>
							)}
							<Button onClick={() => handleDelete(selected)} color='failure'>
								<HiOutlineTrash className='mr-2 h-4 w-4' />
								Delete
							</Button>
						</>
					)}
				</div>
			</div>
		</>
	)
}
