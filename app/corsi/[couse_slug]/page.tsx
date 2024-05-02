import MainWrapper from '@/app/components/MainWrapper'
import LessonBlock from './LessonBlock'

export default function CourseSingle({ params }: { params: { couse_slug: string } }) {
	return (
		<MainWrapper subheaderTitle={params.couse_slug}>
			<LessonBlock
				title='Lezione 1'
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				img={{
					src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714663974/Lazione-2-HTML-Blog_lrsozb.png',
					alt: 'Lezione 1',
				}}
				lessonSlug='lezione-1'
				couseSlug={params.couse_slug}
			/>
			<LessonBlock
				title='Lezione 1'
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				img={{
					src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714663974/Lazione-2-HTML-Blog_lrsozb.png',
					alt: 'Lezione 1',
				}}
				lessonSlug='lezione-1'
				couseSlug={params.couse_slug}
			/>
			<LessonBlock
				title='Lezione 1'
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				img={{
					src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714663974/Lazione-2-HTML-Blog_lrsozb.png',
					alt: 'Lezione 1',
				}}
				lessonSlug='lezione-1'
				couseSlug={params.couse_slug}
			/>
			<LessonBlock
				title='Lezione 1'
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				img={{
					src: 'https://res.cloudinary.com/dqayns3d7/image/upload/v1714663974/Lazione-2-HTML-Blog_lrsozb.png',
					alt: 'Lezione 1',
				}}
				lessonSlug='lezione-1'
				couseSlug={params.couse_slug}
			/>
		</MainWrapper>
	)
}
