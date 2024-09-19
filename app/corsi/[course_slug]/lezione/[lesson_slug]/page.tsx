import MainWrapper from "@/app/components/MainWrapper"
import VideoPlayer from "./components/VideoPlayer"
import { API } from "@/utils/api"
import type { Lesson } from "@/utils/types"
import DOMPurify from "isomorphic-dompurify"
import { HiHome } from "react-icons/hi"
import PathName from "@/app/components/PathName"
import { redirect } from "next/navigation"
import CodePlayer from "./components/CodePlayer"
import CodeSandbox from "./components/CodeSandbox"

interface LessonsPageProps {
	params: { course_slug: string; lesson_slug: string }
}

export default async function LessonsPage({ params }: LessonsPageProps) {
	const response = await API.get<Lesson>(
		`public/lessons/slug/${params.lesson_slug}`,
	).catch(() => {
		return redirect("/404")
	})
	const lesson = response
	const content = "content" in lesson && lesson.content ? lesson.content : ""
	const safeHTML = DOMPurify.sanitize(content)

	let videoContent = null
	if (lesson.video) {
		if (lesson.liveEditor) {
			videoContent = (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
					<VideoPlayer video={lesson.video} />
					<CodePlayer sourceCode={lesson.liveEditor} />
				</div>
			)
		} else {
			videoContent = (
				<div className="">
					<VideoPlayer video={lesson.video} />
				</div>
			)
		}
	}

	return (
		<MainWrapper
			subheaderTitle={lesson.title}
			breadcrumbItems={[
				{ icon: HiHome, label: "Home", href: "/" },
				{ label: "Corsi", href: "/corsi" },
				{ label: lesson.course.title, href: `/corsi/${lesson.course.slug}` },
				{ label: lesson.title },
			]}
		>
			<div className="lesson-page">
				{videoContent}
				<div className="mt-4">
					<h3 className="text-primary_darker dark:text-primary text-2xl">
						Prova il codice
					</h3>
					<CodeSandbox />
				</div>
				<div className="mt-4">
					<h3 className="text-primary_darker dark:text-primary text-2xl">
						Lezione
					</h3>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized */}
					<div dangerouslySetInnerHTML={{ __html: safeHTML }} />
				</div>
			</div>
			<PathName />
		</MainWrapper>
	)
}
