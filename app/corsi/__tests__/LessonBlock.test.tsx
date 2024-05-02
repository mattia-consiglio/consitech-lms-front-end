import React from 'react'
import { render, screen } from '@testing-library/react'
import LessonBlock from '../[couse_slug]/LessonBlock'

describe('LessonBlock', () => {
	it('renders the lesson block with correct title, description, image, and link', () => {
		const lesson = {
			title: 'Test Lesson',
			description: 'This is a test lesson description.',
			img: { src: '/test-lesson-image.png', alt: 'Test Lesson Image' },
			lessonSlug: 'test-lesson',
			couseSlug: 'test-course',
		}
		render(
			<LessonBlock
				title={lesson.title}
				description={lesson.description}
				img={lesson.img}
				lessonSlug={lesson.lessonSlug}
				couseSlug={lesson.couseSlug}
			/>
		)

		expect(screen.getByText(lesson.title)).toBeInTheDocument()
		expect(screen.getByText(lesson.description)).toBeInTheDocument()
		expect(screen.getByRole('img', { name: lesson.img.alt })).toHaveAttribute(
			'src',
			expect.stringContaining(lesson.img.src.slice(1))
		)
		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			`/corsi/${lesson.couseSlug}/lezione/${lesson.lessonSlug}`
		)
	})

	it('applies the correct CSS classes to the lesson block elements', () => {
		const lesson = {
			title: 'Test Lesson',
			description: 'This is a test lesson description.',
			img: { src: '/test-lesson-image.png', alt: 'Test Lesson Image' },
			lessonSlug: 'test-lesson',
			couseSlug: 'test-course',
		}
		render(
			<LessonBlock
				title={lesson.title}
				description={lesson.description}
				img={lesson.img}
				lessonSlug={lesson.lessonSlug}
				couseSlug={lesson.couseSlug}
			/>
		)

		expect(screen.getByRole('link')).toHaveClass(
			'group',
			'flex',
			'items-center',
			'border-b-2',
			'border-transparent',
			'border-neutral-500',
			'hover:border-neutral-300',
			'hover:bg-neutral-100',
			'dark:hover:border-neutral-600',
			'dark:hover:bg-neutral-800',
			'cursor-pointer',
			'p-4',
			'transition-colors',
			'duration-250',
			'ease-in-out'
		)
		expect(screen.getByRole('img')).toHaveClass('max-w-24', 'h-auto', 'w-full', 'object-contain')
		expect(screen.getByText(lesson.description)).toHaveClass(
			'text-neutral-500',
			'dark:text-neutral-400'
		)
		expect(screen.getByTestId('caret-forward-icon')).toHaveClass(
			'text-2xl',
			'grow',
			'min-w-[24px]',
			'group-hover:text-neutral-500',
			'dark:group-hover:text-neutral-400',
			'transition-colors',
			'duration-250',
			'ease-in-out'
		)
	})
})
