import { useDispatch, useSelector, useStore } from 'react-redux'
import pageReducer from '../reducers/pageReducer'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import exp from 'constants'
import userSlice from '../reducers/userSlice'

const rootReducer = combineReducers({
	page: pageReducer,
})

export const makeStore = () => {
	return configureStore({
		reducer: { rootReducer, userSlice },
	})
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
