import { render, screen, fireEvent } from '@testing-library/react'
import AdminContent from '@/app/admin/components/AdminContent'

describe('AdminContent', () => {
	beforeEach(() => {
		render(<AdminContent contentId='new' />)
	})

	it('renders the form', () => {
		expect(screen.getByLabelText('Titolo')).toBeInTheDocument()
		expect(screen.getByLabelText('Slug')).toBeInTheDocument()
		expect(screen.getByLabelText('Descrizione')).toBeInTheDocument()
		expect(screen.getByLabelText('Stato pubblicazione')).toBeInTheDocument()
		expect(screen.getByLabelText('Lingua originale')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Salva' })).toBeInTheDocument()
	})

	it('updates the title value when input changes', () => {
		const titleInput = screen.getByLabelText('Titolo') as HTMLInputElement
		fireEvent.change(titleInput, { target: { value: 'New Title' } })
		expect(titleInput.value).toBe('New Title')
	})

	it('updates the slug value when input changes', () => {
		const slugInput = screen.getByLabelText('Slug') as HTMLInputElement
		fireEvent.change(slugInput, { target: { value: 'new-slug' } })
		expect(slugInput.value).toBe('new-slug')
	})

	it('updates the description value when input changes', () => {
		const descriptionInput = screen.getByLabelText('Descrizione') as HTMLInputElement
		fireEvent.change(descriptionInput, { target: { value: 'New Description' } })
		expect(descriptionInput.value).toBe('New Description')
	})

	it('updates the publish status value when select changes', () => {
		const publishStatusSelect = screen.getByLabelText('Stato pubblicazione') as HTMLSelectElement
		fireEvent.change(publishStatusSelect, { target: { value: 'PUBLISHED' } })
		expect(publishStatusSelect.value).toBe('PUBLISHED')
	})

	it('updates the main language value when select changes', () => {
		const mainLanguageSelect = screen.getByLabelText('Lingua originale') as HTMLSelectElement
		fireEvent.change(mainLanguageSelect, { target: { value: 'en' } })
		expect(mainLanguageSelect.value).toBe('en')
	})

	it('submits the form when save button is clicked', () => {
		const saveButton = screen.getByRole('button', { name: 'Salva' })
		fireEvent.click(saveButton)
		// Add assertions for the submit logic
	})
})
