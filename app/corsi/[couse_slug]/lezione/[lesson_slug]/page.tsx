import MainWrapper from '@/app/components/MainWrapper'
import VideoPlayer from './VideoPlayer'

export default function LessonsPage({
	params,
}: {
	params: { couse_slug: string; lesson_slug: string }
}) {
	return (
		<MainWrapper subheaderTitle={params.lesson_slug}>
			<VideoPlayer videoId='iRtC3YOktr4' />
		</MainWrapper>
	)
}
