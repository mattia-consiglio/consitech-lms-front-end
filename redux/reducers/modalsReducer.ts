import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface Modal {
	isOpen: boolean
	header?: React.JSX.Element | string
	body: React.JSX.Element | string
}

export interface ModalState {
	course: Modal
}

export interface ModalAction {
	type: keyof ModalState
}

export interface ModalActionExtended extends Modal, ModalAction {}

const initialState: ModalState = {
	course: {
		isOpen: false,
		header: undefined,
		body: '',
	},
}

const modalsSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		openModal(state, action: PayloadAction<ModalActionExtended>) {
			const { type, header, body } = action.payload
			state[type].isOpen = true
			state[type].header = header
			state[type].body = body
		},
		closeModal(state, action: PayloadAction<ModalAction>) {
			const { type } = action.payload

			state[type].isOpen = true
			state[type].header = ''
			state[type].body = ''
		},
	},
})

export const { openModal, closeModal } = modalsSlice.actions

export default modalsSlice.reducer
