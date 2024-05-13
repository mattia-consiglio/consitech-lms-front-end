import { User } from '@/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type UserState = {
	id: string
	username: string
	role: 'ADMIN' | 'USER' | ''
	email: string
	error: boolean
}
const initialState: UserState = {
	id: '',
	username: '',
	email: '',
	role: '',
	error: false,
}

const userReducer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<User>) {
			const { id, username, role, email } = action.payload
			state.id = id
			state.username = username
			state.role = role
			state.email = email
		},
		setUserError(state, action: PayloadAction<boolean>) {
			state.error = action.payload
		},
	},
})

export const { setUser, setUserError } = userReducer.actions

export default userReducer.reducer
