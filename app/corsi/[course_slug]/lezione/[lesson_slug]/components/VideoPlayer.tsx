'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import VideoControls from './VideoControls'
import '../videoPlayer.scss'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
	setCurrentTime,
	setIsBuffering,
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

export interface BufferStyle {
	left: string
	width: string
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
	const sources = useMemo(() => generateVideoResolutionSources(video), [video])
	const qualities = useMemo(() => video.resolutions?.map(resolution => resolution.name), [video])
	const [videoSource, setVideoSource] = useState(sources?.[0] || video.url)
	const [currentQuality, setCurrentQuality] = useState(qualities?.[0] || '')
	const player = useRef<HTMLVideoElement>(null)
	const intervalID = useRef<NodeJS.Timeout>()
	const playerWrapper = useRef<HTMLDivElement>(null)
	const { currentTime, playerState, isBuffering } = useAppSelector(state => state.player)
	const dispatch = useAppDispatch()
	const isPlayedOnce = useRef(false)
	const qualityChanged = useRef(false)
	const [buffer, setBuffer] = useState<BufferStyle[]>([])
	const [isFullscreen, setIsFullscreen] = useState(false)
	const fullscreenTimeout = useRef<NodeJS.Timeout | null>(null)
	const [hideControls, setHideControls] = useState(false)
	const lastMousePosition = useRef({ x: 0, y: 0 })
	const shouldKeepControlsVisible = useRef(false)

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

	const openFullscreen = useCallback(() => {
		playerWrapper.current?.requestFullscreen()
		setIsFullscreen(true)
		setHideControls(true)
	}, [playerWrapper])

	const closeFullscreen = useCallback((manually = false) => {
		if (document.fullscreenElement?.id !== 'videoPlayerWrapper' || manually) {
			if (manually) {
				document.exitFullscreen()
			}
			setIsFullscreen(false)
		}
	}, [])

	const toggleFullscreen = useCallback(() => {
		if (document.fullscreenElement?.id === 'videoPlayerWrapper') {
			closeFullscreen(true)
		} else {
			openFullscreen()
		}
	}, [closeFullscreen, openFullscreen])

	const getBuffer = useCallback(
		(setBuffing = false) => {
			if (player.current) {
				if (player.current.buffered.length && setBuffing) dispatch(setIsBuffering(true))
				const buffer: BufferStyle[] = []
				for (let i = 0; i < player.current.buffered.length; i++) {
					const start = player.current.buffered.start(i)
					const end = player.current.buffered.end(i)
					if (start === 0 && end === player.current.duration) return
					if (start === end) continue
					buffer.push({
						left: `${(start / player.current.duration) * 100}%`,
						width: `${((end - start) / player.current.duration) * 100}%`,
					})
				}
				setBuffer(buffer)
			}
		},
		[dispatch]
	)

	const handleHideControls = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const { clientX, clientY } = e
		const { x, y } = lastMousePosition.current
		const distance = Math.sqrt(Math.pow(clientX - x, 2) + Math.pow(clientY - y, 2))

		fullscreenTimeout.current && clearTimeout(fullscreenTimeout.current)
		if (distance > 20) {
			setHideControls(false)
			lastMousePosition.current = { x: clientX, y: clientY }
		}

		fullscreenTimeout.current = setTimeout(() => {
			!shouldKeepControlsVisible.current && setHideControls(true)
			lastMousePosition.current = { x: clientX, y: clientY }
		}, 1000)
	}, [])

	return (
		<div className='flex flex-col gap-3'>
			<div
				className={'flex flex-col gap-3 video-player-wrapper' + (hideControls ? ' hide' : '')}
				ref={playerWrapper}
				id='videoPlayerWrapper'
				role='region'
				aria-label='Video player'
				onFocus={() => {
					addVideoFocus()
				}}
				onMouseMove={e => handleHideControls(e)}
			>
				<video
					ref={player}
					id='player'
					onCanPlay={() => {
						dispatch(setIsBuffering(false))
						if (playerState === PlayerState.PLAYING && qualityChanged.current) {
							player.current?.play()
							qualityChanged.current = false
						}
					}}
					onPlay={() => {
						playerState !== PlayerState.PLAYING && onStateChange(PlayerState.PLAYING)
						getBuffer()
					}}
					onPause={() => {
						onStateChange(PlayerState.PAUSED)
						getBuffer()
					}}
					onSeeked={() => {
						getBuffer()
					}}
					onWaiting={() => {
						getBuffer(true)
					}}
					onEnded={() => {
						onStateChange(PlayerState.ENDED)
					}}
					onLoadedData={() => {
						getBuffer()
					}}
					onLoadedMetadata={() => {
						getBuffer()
					}}
					onLoadStart={() => {
						getBuffer()
					}}
					onProgress={() => {
						getBuffer()
					}}
					onPlaying={() => {
						getBuffer()
					}}
					src={videoSource}
				></video>

				<VideoControls
					duration={video.duration}
					player={player.current}
					seekTo={seekTo}
					qualities={qualities}
					currentQuality={currentQuality}
					changeQuality={changeQuality}
					changeSpeed={changeSpeed}
					buffer={buffer}
					isFullscreen={isFullscreen}
					toggleFullscreen={toggleFullscreen}
					closeFullscreen={closeFullscreen}
					shouldKeepControlsVisible={shouldKeepControlsVisible}
				/>
			</div>
		</div>
	)
}
