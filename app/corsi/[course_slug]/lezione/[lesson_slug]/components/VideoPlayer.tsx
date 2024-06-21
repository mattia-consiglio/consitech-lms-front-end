'use client'
import React, { useRef, useState } from 'react'
import YouTube, { YouTubeEvent, YouTubePlayer, YouTubeProps } from 'react-youtube'
import VideoControls from './VideoControls'
import '../videoPlayer.scss'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setCurrentTime, setPlayerState } from '@/redux/reducers/playerReducer'

interface VideoPlayerProps {
	videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
	const [player, setPlayer] = useState<YouTubePlayer | null>(null)
	const [duration, setDuration] = useState(0)
	const { currentTime, playerState } = useAppSelector(state => state.player)
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout>()
	// const [playerState, setPlayerState] = useState(-1)
	const playerWrapper = useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()
	const isPlayedOnce = useRef(false)

	const onPlayerReady: YouTubeProps['onReady'] = event => {
		// access to player in all event handlers via event.target
		const localPlayer = event.target
		setPlayer(localPlayer)
		setDuration(localPlayer.getDuration())
		dispatch(setCurrentTime(localPlayer.getCurrentTime()))
		const options = localPlayer.getOptions()
		console.log('player options', options)
	}

	const seekTo = (seconds: number) => {
		if (player) {
			player.seekTo(seconds)
			dispatch(setCurrentTime(seconds))
		}
	}

	const onStateChange = (state: YouTubeEvent<number>) => {
		console.log('player options', player)
		// player?.opts
		dispatch(setPlayerState(state.data))
		if (state.data === 0) {
			setCurrentTime(0)
		} else if (state.data === 1) {
			setIntervalID(
				setInterval(() => {
					dispatch(setCurrentTime(player.getCurrentTime() || 0))
					dispatch(setPlayerState(state.data))
				}, 100)
			)
			if (!isPlayedOnce.current) {
				isPlayedOnce.current = true
			}
		} else {
			clearInterval(intervalID)
		}
	}

	const opts: YouTubeProps['opts'] = {
		width: '100%',
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 0,
			controls: 0,
			enablejsapi: true,
			rel: 0,
			disablekb: 0,
		},
	}

	return (
		<div className='flex flex-col gap-3'>
			<div
				className='flex flex-col gap-3 video-player-wrapper'
				ref={playerWrapper}
				id='videoPlayerWrapper'
			>
				<YouTube
					videoId={videoId}
					opts={opts}
					onReady={onPlayerReady}
					onStateChange={onStateChange}
					onPlaybackQualityChange={e => console.log('quality change', e)}
				/>
				{player && (
					<VideoControls
						duration={duration}
						currentTime={currentTime}
						player={player}
						playerState={playerState}
						playerWrapper={playerWrapper}
						isPlayedOnce={isPlayedOnce.current}
					/>
				)}
			</div>
		</div>
	)
}
