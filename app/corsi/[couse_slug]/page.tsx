import MainWrapper from '@/app/components/MainWrapper'
import LessonBlock from './LessonBlock'
import { API } from '@/utils/api'
import { Course, Lesson } from '@/utils/types'
import { HiHome } from 'react-icons/hi'
import PathName from '@/app/components/PathName'
import { redirect } from 'next/navigation'

export default async function CourseSingle({ params }: { params: { couse_slug: string } }) {
	const courseResponse = await API.get<Course>('public/courses/slug/' + params.couse_slug)
	if ('error' in courseResponse) return redirect('/404')
	const course = courseResponse as Course
	const lessonsResponse = await API.get<Lesson[]>(
		'public/courses/slug/' + params.couse_slug + '/lessons'
	)
	const lessons = lessonsResponse as Lesson[]
	return (
		<MainWrapper
			subheaderTitle={course.title}
			braedcrumbItems={[
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
					couseSlug={params.couse_slug}
					displayOrder={lesson.displayOrder}
				/>
			))}
			<PathName />
		</MainWrapper>
	)
}
