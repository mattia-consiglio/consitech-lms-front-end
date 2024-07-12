import { Media, MediaVideo, MediaImage } from '@/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface MediaState {
	selected: Media | MediaImage | MediaVideo | null
}

const initialState: MediaState = {
	selected: null,
}

const mediaReducer = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setSelected(state, action: PayloadAction<MediaState['selected']>) {
			state.selected = action.payload
		},
		setSelectedAlt(state, action: PayloadAction<string>) {
			if (state.selected) {
				state.selected.alt = action.payload
			}
		},
	},
})

export const { setSelected, setSelectedAlt } = mediaReducer.actions

export default mediaReducer.reducer
