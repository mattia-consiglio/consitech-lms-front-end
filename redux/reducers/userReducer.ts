import { User, UserRole } from '@/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type UserState = {
	data: User
	error: boolean
	loggedIn: boolean
}
const initialState: UserState = {
	data: { id: '', username: '', email: '', role: UserRole.USER },
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
			state.data.role = UserRole.USER
			state.loggedIn = false
		},
		userLogin(state) {
			state.loggedIn = true
		},
		setUserLoginStatus(state, action: PayloadAction<boolean>) {
			state.loggedIn = action.payload
		},
	},
})

export const { setUser, setUserError, userLogin, userLogout, setUserLoginStatus } =
	userReducer.actions

export default userReducer.reducer
