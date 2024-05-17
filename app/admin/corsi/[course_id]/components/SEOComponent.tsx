import { AbstractContent, ChangeEvent } from '@/utils/types'
import React from 'react'
import adminStyles from '@/app/admin/styles/admin.module.scss'

interface SEOProps {
	content: AbstractContent
	handleChange: (e: ChangeEvent) => void
}

export default function SEOComponent({ content, handleChange }: SEOProps) {
	const { title, description } = content.seo

	return (
		<>
			<h2>SEO</h2>
			<div>
				<label htmlFor='seo.title' className='block'>
					Title
				</label>
				<input
					type='text'
					name='seo.title'
					id='seo.title'
					value={title}
					onChange={handleChange}
					className={adminStyles.input}
				/>
			</div>
			<div>
				<label htmlFor='seo.description' className='block'>
					Description
				</label>
				<textarea
					id='seo.description'
					name='seo.description'
					value={description}
					onChange={handleChange}
					className={adminStyles.input}
				></textarea>
			</div>
		</>
	)
}
