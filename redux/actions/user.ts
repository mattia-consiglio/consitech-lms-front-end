import { API } from '@/utils/api'
import { AppDispatch, RootState } from '../store'
import { User } from '@/utils/types'
import { setUser, setUserError, userLogin, userLogout } from '../reducers/userReducer'

export const getUserAction = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		await API.get<User>('users/me')
			.then(response => {
				dispatch(
					setUser({
						id: response.id,
						username: response.username,
						role: response.role,
						email: response.email,
					})
				)

				dispatch(setUserError(false))
				dispatch(userLogin())
			})
			.catch(() => {
				dispatch(setUserError(true))
				dispatch(userLogout())
			})
	}
}
