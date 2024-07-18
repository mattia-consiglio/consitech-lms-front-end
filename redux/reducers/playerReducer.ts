import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface PlayerState {
	currentTime: number
	playerState: number
	isInFocus: boolean
}

const initialState: PlayerState = {
	currentTime: 0,
	playerState: -1,
	isInFocus: false,
}

const playerReducer = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setCurrentTime(state, action: PayloadAction<number>) {
			state.currentTime = action.payload
		},
		setPlayerState(state, action: PayloadAction<number>) {
			state.playerState = action.payload
		},
		setPlayerIsInFocus(state, action: PayloadAction<boolean>) {
			state.isInFocus = action.payload
		},
	},
})

export const { setCurrentTime, setPlayerState, setPlayerIsInFocus } = playerReducer.actions

export default playerReducer.reducer
