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
		setSelectedMedia(state, action: PayloadAction<MediaState['selected']>) {
			state.selected = action.payload
		},
		setSelectedMediaAlt(state, action: PayloadAction<string>) {
			if (state.selected) {
				state.selected.alt = action.payload
			}
		},
	},
})

export const { setSelectedMedia, setSelectedMediaAlt } = mediaReducer.actions

export default mediaReducer.reducer
