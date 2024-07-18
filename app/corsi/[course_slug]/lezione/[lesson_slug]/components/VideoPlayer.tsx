'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import VideoControls from './VideoControls'
import '../videoPlayer.scss'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
	setCurrentTime,
	setPlayerIsInFocus,
	setPlayerState,
	setVideoSpeed,
} from '@/redux/reducers/playerReducer'
import { MediaVideo } from '@/utils/types'

interface VideoPlayerProps {
	video: MediaVideo
}

function generateVideoResolutionSources(video: MediaVideo) {
	if (!video.resolutions) return
	const videoUrlBase = video.url.replace(/\.mp4$/, '')
	return video.resolutions.map(resolution => {
		return videoUrlBase + '_' + resolution.name + '.mp4'
	})
}

export enum PlayerState {
	UNSTARTED = -1,
	ENDED = 0,
	PLAYING = 1,
	PAUSED = 2,
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
	const sources = useMemo(() => generateVideoResolutionSources(video), [video])
	const qualities = useMemo(() => video.resolutions?.map(resolution => resolution.name), [video])
	const [videoSource, setVideoSource] = useState(sources?.[0] || video.url)
	const [currentQuality, setCurrentQuality] = useState(qualities?.[0] || '')
	const player = useRef<HTMLVideoElement>(null)
	const intervalID = useRef<NodeJS.Timeout>()
	const playerWrapper = useRef<HTMLDivElement>(null)
	const { currentTime, playerState } = useAppSelector(state => state.player)
	const dispatch = useAppDispatch()
	const isPlayedOnce = useRef(false)
	const qualityChanged = useRef(false)

	const seekTo = (seconds: number) => {
		if (player.current) {
			player.current.currentTime = seconds
			dispatch(setCurrentTime(seconds))
		}
	}

	const onStateChange = (state: PlayerState) => {
		dispatch(setPlayerState(state))
		if (state === PlayerState.ENDED) {
			setCurrentTime(0)
		} else if (state === PlayerState.PLAYING) {
			dispatch(setPlayerState(state))
			intervalID.current = setInterval(() => {
				dispatch(setCurrentTime(player.current?.currentTime || 0))
			}, 150)

			if (!isPlayedOnce.current) {
				isPlayedOnce.current = true
			}
		} else {
			clearInterval(intervalID.current)
		}
	}

	const changeQuality = (quality: string) => {
		const qualityIndex = qualities?.indexOf(quality)

		if (qualityIndex !== undefined && qualityIndex >= 0 && sources) {
			setCurrentQuality(quality)
			setVideoSource(sources[qualityIndex])
			player.current?.load()
			seekTo(currentTime)
			qualityChanged.current = true
		}
	}

	const changeSpeed = (speed: number) => {
		if (player.current) {
			player.current.playbackRate = speed
			dispatch(setVideoSpeed(speed))
		}
	}

	const addVideoFocus = useCallback(() => {
		dispatch(setPlayerIsInFocus(true))
	}, [dispatch])

	useEffect(() => {
		addVideoFocus()
	}, [addVideoFocus])

	return (
		<div className='flex flex-col gap-3'>
			<div
				className='flex flex-col gap-3 video-player-wrapper'
				ref={playerWrapper}
				id='videoPlayerWrapper'
				tabIndex={0}
				onFocus={() => {
					addVideoFocus()
				}}
			>
				<video
					ref={player}
					id='player'
					onCanPlay={() => {
						if (playerState === PlayerState.PLAYING && qualityChanged.current) {
							player.current?.play()

							qualityChanged.current = false
						}
					}}
					onPlay={() => {
						playerState !== PlayerState.PLAYING && onStateChange(PlayerState.PLAYING)
					}}
					onPause={() => {
						onStateChange(PlayerState.PAUSED)
					}}
					src={videoSource}
				></video>

				{player.current && (
					<VideoControls
						duration={video.duration}
						player={player.current}
						playerWrapper={playerWrapper}
						isPlayedOnce={isPlayedOnce.current}
						seekTo={seekTo}
						qualities={qualities}
						currentQuality={currentQuality}
						setCurrentQuality={setCurrentQuality}
						changeQuality={changeQuality}
						changeSpeed={changeSpeed}
					/>
				)}
			</div>
		</div>
	)
}
