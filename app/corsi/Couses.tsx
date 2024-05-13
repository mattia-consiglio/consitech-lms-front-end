import React, { Suspense } from 'react'
import CourseBlock from './CourseBlock'
import { PagableContent, Course } from '@/utils/types'
import { API } from '@/utils/api'

export default async function CousesComponent() {
	const data: PagableContent<Course> = await API.get('public/courses')
	const courses = data?.content
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 mt-4'>
			<Suspense fallback={'Caricamento'}>
				{courses.map(course => (
					<CourseBlock
						key={course.id}
						title={course.title}
						description={course.description}
						img={course.thumbnail}
						slug={course.slug}
						displayOrder={course.displayOrder}
					/>
				))}
			</Suspense>
		</div>
	)
}
