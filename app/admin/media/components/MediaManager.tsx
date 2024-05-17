'use client'
import { setSelected, setSelectedAlt } from '@/redux/reducers/mediaReducer'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { API } from '@/utils/api'
import { Media, PageableContent } from '@/utils/types'
import Image from 'next/image'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import toast from 'react-hot-toast'
import { Button } from 'flowbite-react'
import { HiOutlineTrash } from 'react-icons/hi'
import { customButtonTheme } from '@/app/flowbite.themes'

export default function MediaManager({ displayTitle = true }: { displayTitle?: boolean }) {
	const selected = useAppSelector(state => state.media.selected)
	const dispatch = useAppDispatch()
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>()
	const [media, setMedia] = useState<PageableContent<Media>>({} as PageableContent<Media>)
	const fileRef = useRef<HTMLInputElement>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const fetchMedia = async () => {
		API.get<PageableContent<Media>>('media')
			.then(response => {
				setMedia(response)
			})
			.catch(error => {
				setError(error.message)
			})
	}

	const handleSelect = (media: Media) => {
		if (selected && selected.id === media.id) {
			dispatch(setSelected(null))
		} else {
			dispatch(setSelected(media))
		}
	}

	const handleDelete = (media: Media | null) => {
		if (!media) return
		const confirm = window.confirm('Sei sicuro di voler eliminare questo media?')
		if (confirm) {
			setLoading(true)
			API.delete(`media/${media.id}`)
				.then(() => {
					toast.success('Media eliminato con successo')
					fetchMedia()
					dispatch(setSelected(null))
					setSearch('')
					setError(undefined)
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
		setError(undefined)
		const formData = new FormData()
		formData.append('thumbnail', e.currentTarget.files[0])
		API.post<Media>('media/upload', formData, null)
			.then(response => {
				toast.success('Media caricato con successo')
				setMedia({ ...media, content: [response, ...media.content] })
				dispatch(setSelected(response))
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
				setError(undefined)
			})
			.catch((error: Error) => {
				toast.error(error.message)
				setError(error.message)
			})
	}

	useEffect(() => {
		fetchMedia()
	}, [])
	return (
		<>
			<div>
				{displayTitle && <h1>Media manager</h1>}
				<Button as='label' theme={customButtonTheme} outline htmlFor='file'>
					Carica media
				</Button>
				<input
					type='file'
					name='file'
					id='file'
					className='hidden'
					onInput={e => handleUpload(e)}
					accept='image/*'
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
					<Suspense fallback={<div>Caricamento...</div>}>
						{media.content &&
							media.content.map(m => (
								<div
									key={m.id}
									className={`flex border-4 hover:border-neutral-500 bg-neutral-200 dark:bg-neutral-300 w-[200px] aspect-square max-w-full h-auto items-center justify-center group-[radio]-checked:border-primary p-2
											${selected && m.id === selected.id && ' border-primary hover:border-primary_darker'}`}
									onClick={() => handleSelect(m)}
								>
									<Image width={200} height={200} alt={m.alt || ''} src={m.url} />
								</div>
							))}
						{media && media.content && media.content.length === 0 && (
							<div>Nessun media trovato</div>
						)}
					</Suspense>
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
									dispatch(setSelectedAlt(e.target.value))
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
							<p>
								Dimensioni (LxA): {selected?.width}x{selected?.height}{' '}
							</p>
							<p>Colore principale: {selected?.mainColor}</p>
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
