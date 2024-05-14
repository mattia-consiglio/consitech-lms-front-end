import { useDispatch, useSelector, useStore } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from '../reducers/userSlice'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import modalsSlice from '../reducers/modalsSlice'

const createNoopStorage = () => {
	return {
		getItem() {
			return Promise.resolve(null)
		},
		setItem(_key: string, value: number) {
			return Promise.resolve(value)
		},
		removeItem() {
			return Promise.resolve()
		},
	}
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const userPersistConfig = {
	key: 'user',
	storage: storage,
	whitelist: ['loggedIn'],
}

const rootReducer = combineReducers({
	user: persistReducer(userPersistConfig, userSlice),
	modals: modalsSlice,
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
// export const useAppStore = useStore.withTypes<AppStore>()
