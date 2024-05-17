import { API } from '@/utils/api'
import { AppDispatch, RootState } from '../store'
import { ResponseError, User } from '@/utils/types'
import { setUser, setUserError, userLogin, userLogout } from '../reducers/userReducer'

export const getUserAction = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const response = await API.get<User>('users/me')
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
			.catch(error => {
				dispatch(setUserError(true))
				dispatch(userLogout())
			})
	}
}
