"use client"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import VideoControls from "./VideoControls"
import "../videoPlayer.scss"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import {
	setCurrentTime,
	setIsBuffering,
	setPlayerIsInFocus,
	setPlayerState,
	setVideoSpeed,
} from "@/redux/reducers/playerReducer"
import type { MediaVideo } from "@/utils/types"

interface VideoPlayerProps {
	video: MediaVideo
}

function generateVideoResolutionSources(video: MediaVideo) {
	if (!video.resolutions) return
	const videoUrlBase = video.url.replace(/\.mp4$/, "")
	return video.resolutions.map((resolution) => {
		return `${videoUrlBase}_${resolution.name}.mp4`
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

export default function VideoPlayer({ video }: Readonly<VideoPlayerProps>) {
	const sources = useMemo(() => generateVideoResolutionSources(video), [video])
	const qualities = useMemo(
		() => [
			"Auto",
			...(video.resolutions?.map((resolution) => resolution.name) || []),
		],
		[video],
	)
	const [videoSource, setVideoSource] = useState(sources?.[0] ?? video.url)
	const [currentQuality, setCurrentQuality] = useState("Auto")
	const [isAutoQuality, setIsAutoQuality] = useState(true)
	const lastQualityCheck = useRef(Date.now())
	const player = useRef<HTMLVideoElement>(null)
	const intervalID = useRef<NodeJS.Timeout>()
	const playerWrapper = useRef<HTMLDivElement>(null)
	const { playerState } = useAppSelector((state) => state.player)
	const dispatch = useAppDispatch()
	const isPlayedOnce = useRef(false)
	const qualityChanged = useRef(false)
	const [buffer, setBuffer] = useState<BufferStyle[]>([])
	const [isFullscreen, setIsFullscreen] = useState(false)
	const fullscreenTimeout = useRef<NodeJS.Timeout | null>(null)
	const [hideControls, setHideControls] = useState(false)
	const lastMousePosition = useRef({ x: 0, y: 0 })
	const shouldKeepControlsVisible = useRef(false)
	const [volume, setVolume] = useState(1)
	const [isMuted, setIsMuted] = useState(false)
	const [componentMounted, setComponentMounted] = useState(false)

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
				dispatch(setCurrentTime(player.current?.currentTime ?? 0))
			}, 150)

			if (!isPlayedOnce.current) {
				isPlayedOnce.current = true
			}
		} else {
			clearInterval(intervalID.current)
		}
	}

	const handleCanPlay = useCallback(
		(currentTime: number, wasPlaying: boolean) => {
			if (player.current) {
				player.current.currentTime = currentTime
				if (wasPlaying) {
					player.current.play()
				}
			}
		},
		[],
	)

	const checkBandwidth = useCallback(async () => {
		if (!isAutoQuality || !player.current || !qualities || !sources) return
		// Prevent too frequent checks (minimum 5 seconds between checks)
		const now = Date.now()
		if (now - lastQualityCheck.current < 5000) return
		lastQualityCheck.current = now

		try {
			// Use Navigator.connection API if available
			const connection = (
				navigator as unknown as { connection?: { downlink: number } }
			).connection
			let bandwidth = connection?.downlink ?? 10 // Mbps

			// If API is not available, estimate based on buffer
			if (!connection && player.current.buffered.length > 0) {
				const buffered = player.current.buffered
				const lastBufferEnd = buffered.end(buffered.length - 1)
				const lastBufferStart = buffered.start(buffered.length - 1)
				const loadedSeconds = lastBufferEnd - lastBufferStart
				if (loadedSeconds > 0) {
					bandwidth =
						(loadedSeconds *
							player.current.videoWidth *
							player.current.videoHeight *
							3) /
						(1024 * 1024 * 8)
				}
			}

			// Select appropriate quality based on bandwidth
			let targetQualityIndex = 0 // Lowest quality index
			if (bandwidth >= 10) {
				targetQualityIndex = sources.length - 1 // Highest quality
			} else if (bandwidth >= 5) {
				targetQualityIndex = Math.floor(sources.length * 0.75)
			} else if (bandwidth >= 2) {
				targetQualityIndex = Math.floor(sources.length * 0.5)
			}

			// Change quality only if necessary and if video is ready
			if (
				sources[targetQualityIndex] &&
				sources[targetQualityIndex] !== videoSource &&
				player.current.readyState > 0
			) {
				const currentTime = player.current.currentTime
				const wasPlaying = !player.current?.paused
				setVideoSource(sources[targetQualityIndex])
				qualityChanged.current = true

				const handleQualityChange = () => {
					handleCanPlay(currentTime, wasPlaying)
					player.current?.removeEventListener("canplay", handleQualityChange)
				}

				player.current?.addEventListener("canplay", handleQualityChange)
			}
		} catch (error) {
			console.error("Error checking bandwidth:", error)
		}
	}, [isAutoQuality, qualities, sources, videoSource, handleCanPlay])

	useEffect(() => {
		if (isAutoQuality) {
			if (componentMounted) {
				// Check bandwidth every 30 seconds
				const intervalId = setInterval(checkBandwidth, 10000)
				return () => clearInterval(intervalId)
			}
			checkBandwidth()
		}
	}, [isAutoQuality, checkBandwidth, componentMounted])

	useEffect(() => {
		setComponentMounted(true)
	}, [])

	const changeQuality = (quality: string) => {
		if (quality === "Auto" && !isAutoQuality) {
			setIsAutoQuality(true)
			setCurrentQuality("Auto")
			// Start with current quality, then let bandwidth check adjust if needed
			checkBandwidth()
			return
		}

		setIsAutoQuality(false)
		const qualityIndex = qualities.indexOf(quality) - 1 // -1 to compensate for "Auto"

		if (qualityIndex >= 0 && sources?.[qualityIndex]) {
			const currentTime = player.current?.currentTime ?? 0
			const wasPlaying = !player.current?.paused

			setCurrentQuality(quality)
			setVideoSource(sources[qualityIndex])
			qualityChanged.current = true

			// Wait for the video to be ready before setting time and playing
			const handleQualityChange = () => {
				handleCanPlay(currentTime, wasPlaying)
				player.current?.removeEventListener("canplay", handleQualityChange)
			}

			player.current?.addEventListener("canplay", handleQualityChange)
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

		// Previene la copia dell'URL del video
		const preventCopy = (e: ClipboardEvent) => {
			e.preventDefault()
		}

		document.addEventListener("copy", preventCopy)

		return () => {
			document.removeEventListener("copy", preventCopy)
		}
	}, [addVideoFocus])

	const openFullscreen = useCallback(() => {
		playerWrapper.current?.requestFullscreen()
		setIsFullscreen(true)
		setHideControls(true)
	}, [])

	const closeFullscreen = useCallback((manually = false) => {
		if (document.fullscreenElement?.id !== "videoPlayerWrapper" || manually) {
			if (manually) {
				document.exitFullscreen()
			}
			setIsFullscreen(false)
		}
	}, [])

	const toggleFullscreen = useCallback(() => {
		if (document.fullscreenElement?.id === "videoPlayerWrapper") {
			closeFullscreen(true)
		} else {
			openFullscreen()
		}
	}, [closeFullscreen, openFullscreen])

	const getBuffer = useCallback(
		(setBuffing = false) => {
			if (player.current) {
				if (player.current.buffered.length && setBuffing)
					dispatch(setIsBuffering(true))
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
		[dispatch],
	)

	const handleHideControls = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const { clientX, clientY } = e
			const { x, y } = lastMousePosition.current
			const distance = Math.sqrt((clientX - x) ** 2 + (clientY - y) ** 2)

			if (fullscreenTimeout.current) clearTimeout(fullscreenTimeout.current)
			if (distance > 20) {
				setHideControls(false)
				lastMousePosition.current = { x: clientX, y: clientY }
			}

			fullscreenTimeout.current = setTimeout(() => {
				if (!shouldKeepControlsVisible.current) setHideControls(true)
				lastMousePosition.current = { x: clientX, y: clientY }
			}, 1000)
		},
		[],
	)

	const handleVolumeChange = (newVolume: number) => {
		if (player.current) {
			player.current.volume = newVolume
			setVolume(newVolume)
			if (newVolume > 0) {
				setIsMuted(false)
			}
		}
	}

	const toggleMute = () => {
		if (player.current) {
			if (isMuted) {
				player.current.volume = volume
				setIsMuted(false)
			} else {
				player.current.volume = 0
				setIsMuted(true)
			}
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<div
				className={`flex flex-col gap-3 video-player-wrapper${hideControls ? " hide" : ""}`}
				ref={playerWrapper}
				id="videoPlayerWrapper"
				aria-label="Video player"
				onFocus={() => {
					addVideoFocus()
				}}
				onMouseMove={(e) => handleHideControls(e)}
				onDragStart={(e) => e.preventDefault()}
			>
				<video
					ref={player}
					id="player"
					className="w-full h-full"
					controlsList="nodownload"
					onContextMenu={(e) => e.preventDefault()}
					disablePictureInPicture
					disableRemotePlayback
					style={{ userSelect: "none", WebkitUserSelect: "none" }}
					draggable={false}
					crossOrigin="anonymous"
					playsInline
					onCanPlay={() => {
						dispatch(setIsBuffering(false))
						if (playerState === PlayerState.PLAYING && qualityChanged.current) {
							player.current?.play()
							qualityChanged.current = false
						}
					}}
					onPlay={() => {
						if (playerState !== PlayerState.PLAYING)
							onStateChange(PlayerState.PLAYING)
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
				>
					<track kind="captions" label="Italian" srcLang="it" default />
					Your browser does not support the video tag.
				</video>

				<VideoControls
					duration={player.current?.duration || 0}
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
					volume={volume}
					isMuted={isMuted}
					onVolumeChange={handleVolumeChange}
					onToggleMute={toggleMute}
				/>
			</div>
		</div>
	)
}
