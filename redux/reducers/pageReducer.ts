import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type PageState = {
	subheaderTitle: string | undefined
}
const initialState: PageState = {
	subheaderTitle: undefined,
}

const pageReducer = createSlice({
	name: 'page',
	initialState,
	reducers: {
		setSubheaderTitle: (state, action: PayloadAction<string>) => {
			state.subheaderTitle = action.payload
		},
	},
})

export const { setSubheaderTitle } = pageReducer.actions

export default pageReducer.reducer
