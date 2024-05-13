import { User } from '@/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type UserState = {
	data: User
	error: boolean
	loggedIn: boolean
}
const initialState: UserState = {
	data: { id: '', username: '', email: '', role: 'USER' },
	error: false,
	loggedIn: false,
}

const userReducer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<User>) {
			const { id, username, role, email } = action.payload
			state.data.id = id
			state.data.username = username
			state.data.role = role
			state.data.email = email
		},
		setUserError(state, action: PayloadAction<boolean>) {
			state.error = action.payload
		},
		userLogout(state) {
			state.data.id = ''
			state.data.username = ''
			state.data.email = ''
			state.data.role = 'USER'
			state.loggedIn = false
		},
		userLogin(state) {
			state.loggedIn = true
		},
	},
})

export const { setUser, setUserError, userLogin, userLogout } = userReducer.actions

export default userReducer.reducer
