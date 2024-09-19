import React from "react"
import { render, screen } from "@testing-library/react"
import CourseBlock from "../components/CourseBlock"
import {
	MediaType,
	PublishStatus,
	UserRole,
	type MediaImage,
} from "@/utils/types"

const course = {
	id: "1",
	title: "Test Course",
	description: "This is a test description.",
	thumbnail: {
		filename: "test-lesson-image.png",
		alt: "Test Lesson Image",
		id: "",
		url: "/test-lesson-image.png",
		type: MediaType.IMAGE,
		uploadedAt: new Date(),
		parentId: null,
		width: 0,
		height: 0,
		avgColor: "",
	} as MediaImage,
	slug: "test-course",
	displayOrder: 0,
	publishStatus: PublishStatus.PUBLIC,
	role: UserRole.USER,
}

describe("CourseBlock", () => {
	it("renders the course block with correct title, description, image, and link", () => {
		render(<CourseBlock {...course} />)

		expect(screen.getByText(course.title)).toBeInTheDocument()
		expect(screen.getByText(course.description)).toBeInTheDocument()
		expect(
			screen.getByRole("img", { name: course.thumbnail.alt }),
		).toHaveAttribute(
			"src",
			expect.stringContaining(course.thumbnail.url.slice(1)),
		)
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			`/corsi/${course.slug}`,
		)
	})

	it("applies the correct Tailwind CSS classes", () => {
		render(<CourseBlock {...course} />)

		expect(screen.getByRole("link")).toHaveClass("flex")
		expect(screen.getByRole("link")).toHaveClass("flex-col")
		expect(screen.getByRole("link")).toHaveClass("items-center")
		expect(screen.getByRole("link")).toHaveClass("border-3")
		expect(screen.getByRole("link")).toHaveClass("border-transparent")
		expect(screen.getByRole("link")).toHaveClass("hover:border-neutral-300")
		expect(screen.getByRole("link")).toHaveClass("hover:bg-neutral-100")
		expect(screen.getByRole("link")).toHaveClass(
			"dark:hover:border-neutral-700",
		)
		expect(screen.getByRole("link")).toHaveClass("dark:hover:bg-neutral-800")
		expect(screen.getByRole("link")).toHaveClass("cursor-pointer")
		expect(screen.getByRole("link")).toHaveClass("p-4")
		expect(screen.getByRole("link")).toHaveClass("transition-colors")
		expect(screen.getByRole("link")).toHaveClass("duration-250")
		expect(screen.getByRole("link")).toHaveClass("ease-in-out")

		expect(screen.getByRole("img")).toHaveClass("max-w-20")
		expect(screen.getByRole("img")).toHaveClass("h-auto")
		expect(screen.getByRole("img")).toHaveClass("w-full")
		expect(screen.getByRole("img")).toHaveClass("object-contain")

		expect(screen.getByRole("heading")).toHaveClass("mb-2")
		expect(screen.getByRole("heading")).toHaveClass("mt-3")

		expect(screen.getByText(course.description)).toHaveClass("text-center")
	})
})
