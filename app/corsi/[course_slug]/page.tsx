import MainWrapper from '@/app/components/MainWrapper'
import LessonBlock from './LessonBlock'
import { API } from '@/utils/api'
import { Course, Lesson } from '@/utils/types'
import { HiHome } from 'react-icons/hi'
import PathName from '@/app/components/PathName'
import { redirect } from 'next/navigation'

export default async function CourseSingle({ params }: { params: { course_slug: string } }) {
	const course = await API.get<Course>('public/courses/slug/' + params.course_slug).catch(_ => {
		redirect('/404')
	})

	const lessons = await API.get<Lesson[]>(
		'public/courses/slug/' + params.course_slug + '/lessons'
	).catch(_ => [])

	return (
		<MainWrapper
			subheaderTitle={course.title}
			breadcrumbItems={[
				{ icon: HiHome, label: 'Home', href: '/' },
				{ label: 'Corsi', href: '/corsi' },
				{ label: course.title },
			]}
		>
			{lessons.map(lesson => (
				<LessonBlock
					key={lesson.id}
					title={lesson.title}
					description={lesson.description}
					img={lesson.thumbnail}
					lessonSlug={lesson.slug}
					courseSlug={params.course_slug}
					displayOrder={lesson.displayOrder}
				/>
			))}
			<PathName />
		</MainWrapper>
	)
}
