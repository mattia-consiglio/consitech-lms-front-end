import { API } from '@/utils/api'
import { AppDispatch, RootState } from '../store'
import { ResponseError, User } from '@/utils/types'
import { setUser, setUserError } from '../reducers/userSlice'

export const getUserAction = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const response: ResponseError | User = await API.get('users/me')

		if ('message' in response) {
			dispatch(setUserError(true))
		} else {
			dispatch(
				setUser({
					id: response.id,
					username: response.username,
					role: response.role,
					email: response.email,
				})
			)
		}
	}
}
