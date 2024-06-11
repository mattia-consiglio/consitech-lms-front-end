import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface PlayerState {
	currentTime: number
	playerState: number
}

const initialState: PlayerState = {
	currentTime: 0,
	playerState: -1,
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
	},
})

export const { setCurrentTime, setPlayerState } = playerReducer.actions

export default playerReducer.reducer
