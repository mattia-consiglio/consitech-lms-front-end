import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import pageReducer from './reducers/pageReducer'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
	page: pageReducer,
})

const store = configureStore({
	reducer: rootReducer,
})

export default store
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
