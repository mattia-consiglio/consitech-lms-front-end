import Home from '@/app/page'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Home', () => {
	it('renders the main content', () => {
		const { getByText } = render(<Home />)
		expect(getByText('Get started by editing')).toBeInTheDocument()
		expect(getByText('By Vercel')).toBeInTheDocument()
		expect(getByText('Docs')).toBeInTheDocument()
		expect(getByText('Learn')).toBeInTheDocument()
		expect(getByText('Templates')).toBeInTheDocument()
		expect(getByText('Deploy')).toBeInTheDocument()
	})

	it('renders the Next.js logo', () => {
		const { getByAltText } = render(<Home />)
		const logo = getByAltText('Next.js Logo')
		expect(logo).toBeInTheDocument()
	})

	it('renders the Vercel logo', () => {
		const { getByAltText } = render(<Home />)
		const logo = getByAltText('Vercel Logo')
		expect(logo).toBeInTheDocument()
	})

	it('renders the correct links', () => {
		const { getAllByRole } = render(<Home />)
		const links = getAllByRole('link')
		expect(links).toHaveLength(5)
		expect(links[0]).toHaveAttribute(
			'href',
			'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
		)
		expect(links[1]).toHaveAttribute(
			'href',
			'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
		)
		expect(links[2]).toHaveAttribute(
			'href',
			'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
		)
		expect(links[3]).toHaveAttribute(
			'href',
			'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
		)
		expect(links[4]).toHaveAttribute(
			'href',
			'https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
		)
	})
})
