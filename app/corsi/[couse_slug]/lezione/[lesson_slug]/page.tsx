export default function LessonsPage({
	params,
}: {
	params: { couse_slug: string; lesson_slug: string }
}) {
	return (
		<div>
			Course slug: {params.couse_slug}, Lesson slug: {params.lesson_slug}
		</div>
	)
}
