import MainWrapper from '@/app/components/MainWrapper'
import VideoPlayer from './components/VideoPlayer'
import dynamic from 'next/dynamic'
import { API } from '@/utils/api'
import { Lesson } from '@/utils/types'
import DOMPurify from 'isomorphic-dompurify'
import { HiHome } from 'react-icons/hi'
import PathName from '@/app/components/PathName'
import { redirect } from 'next/navigation'
import CodePlayer from './components/CodePlayer'

const CodeEditor = dynamic(() => import('./components/CodeEditor'), {
	ssr: false,
})

interface LessonsPageProps {
	params: { course_slug: string; lesson_slug: string }
}

export default async function LessonsPage({ params }: LessonsPageProps) {
	const response = await API.get<Lesson>('public/lessons/slug/' + params.lesson_slug).catch(() => {
		return redirect('/404')
	})
	const lesson = response as Lesson
	const content = 'content' in lesson && lesson.content ? lesson.content : ''
	const safeHTML = DOMPurify.sanitize(content)

	return (
		<MainWrapper
			subheaderTitle={lesson.title}
			breadcrumbItems={[
				{ icon: HiHome, label: 'Home', href: '/' },
				{ label: 'Corsi', href: '/corsi' },
				{ label: lesson.course.title, href: '/corsi/' + lesson.course.slug },
				{ label: lesson.title },
			]}
		>
			<div className='lesson-page'>
				{lesson.videoId ? (
					lesson.liveEditor ? (
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 items-center'>
							<VideoPlayer videoId={lesson.videoId} />
							<CodePlayer sourceCode={lesson.liveEditor} />
						</div>
					) : (
						<div className=''>
							<VideoPlayer videoId={lesson.videoId} />
						</div>
					)
				) : (
					''
				)}
				<div className='mt-4'>
					<h3 className='text-primary_darker dark:text-primary text-2xl'>Prova il codice</h3>
					<CodeEditor
						key='code-editor'
						files={{ 'sandbox/index.html': { name: 'index.html', language: 'html', value: '' } }}
						currenFile='try.html'
					/>
				</div>
				<div className='mt-4'>
					<h3 className='text-primary_darker dark:text-primary text-2xl'>Lezione</h3>
					<div dangerouslySetInnerHTML={{ __html: safeHTML }}></div>
				</div>
			</div>
			<PathName />
		</MainWrapper>
	)
}
