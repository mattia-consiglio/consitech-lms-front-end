import MainWrapper from '@/app/components/MainWrapper'
import LessonBlock from './LessonBlock'
import { API } from '@/utils/api'
import { Course, Lesson } from '@/utils/types'
import { HiHome } from 'react-icons/hi'

export default async function CourseSingle({ params }: { params: { couse_slug: string } }) {
	const course: Course = await API.get('public/courses/slug/' + params.couse_slug)
	const lessons: Lesson[] = await API.get('public/courses/slug/' + params.couse_slug + '/lessons')
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
		</MainWrapper>
	)
}
