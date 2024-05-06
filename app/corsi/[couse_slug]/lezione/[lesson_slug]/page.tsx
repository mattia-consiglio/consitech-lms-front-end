import MainWrapper from '@/app/components/MainWrapper'
import VideoPlayer from './VideoPlayer'
import CodeEditor from './CodeEditor'

export default function LessonsPage({
	params,
}: {
	params: { couse_slug: string; lesson_slug: string }
}) {
	return (
		<MainWrapper subheaderTitle={params.lesson_slug}>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 items-center'>
				<VideoPlayer videoId='iRtC3YOktr4' />
				<CodeEditor />
			</div>
			<div className='mt-4'>
				<h3 className='text-primary_darker dark:text-primary text-2xl'>Prova il codice</h3>
				<CodeEditor />
			</div>
			<div className='mt-4'>
				<h3 className='text-primary_darker dark:text-primary text-2xl'>Lezione</h3>
				<p>Ma prima d’imparare le basi, è dovere imparare un po’ di teoria.</p>
				<p>
					Prima di tutto ti sei mai chiesto perché dovresti imparare questo linguaggio? Beh, ecco
					delle buone motivazioni:
				</p>
				<ul>
					<li>
						È <strong>facile</strong> da apprendere
					</li>
					<li>
						È <strong>la base</strong> di tutte le pagine web che vedi online, anche questa.
					</li>
					<li>
						È <strong>open-source</strong>
					</li>
					<li>
						È facile trovare <strong>guide</strong>
					</li>
				</ul>
			</div>
		</MainWrapper>
	)
}
