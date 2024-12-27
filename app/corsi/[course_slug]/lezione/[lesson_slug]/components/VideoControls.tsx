import { useAppSelector } from "@/redux/store"
import type React from "react"
import {
	type MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	IoChevronBackSharp,
	IoChevronForwardSharp,
	IoPauseSharp,
	IoPlaySharp,
	IoSettingsSharp,
	IoVolumeHigh,
	IoVolumeLow,
	IoVolumeMedium,
	IoVolumeMute,
} from "react-icons/io5"
import {
	MdFullscreen,
	MdOutlineCheck,
	MdOutlineFullscreenExit,
} from "react-icons/md"
import { type BufferStyle, PlayerState } from "./VideoPlayer"

interface VideoProgressBarProps {
	duration: number
	player: HTMLVideoElement | null
	seekTo: (time: number) => void
	qualities: string[] | null
	currentQuality: string
	changeQuality: (quality: string) => void
	changeSpeed: (speed: number) => void
	buffer: BufferStyle[]
	isFullscreen: boolean
	toggleFullscreen: () => void
	closeFullscreen: () => void
	shouldKeepControlsVisible: MutableRefObject<boolean>
	volume: number
	isMuted: boolean
	onVolumeChange: (volume: number) => void
	onToggleMute: () => void
}

function PlayIcon() {
	return (
		<svg
			stroke="currentColor"
			fill="currentColor"
			strokeWidth="0"
			xmlns="http://www.w3.org/2000/svg"
			height="1em"
			width="1em"
			viewBox="0 0 79 79"
		>
			<title>Play</title>
			<polygon points="73.71 39.5 5.29 0 5.29 79 73.71 39.5" />
		</svg>
	)
}

function PauseIcon() {
	return (
		<svg
			stroke="currentColor"
			fill="currentColor"
			strokeWidth="0"
			height="1em"
			width="1em"
			viewBox="0 0 79 79"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Pause</title>
			<g>
				<rect x="5" width="24" height="79" />
				<rect x="50.5" width="24" height="79" />
			</g>
		</svg>
	)
}

export function formatTime(time: number) {
	const minutes = Math.floor(time / 60)
	const seconds = Math.floor(time % 60)
	const secondsText = seconds < 10 ? `0${seconds}` : seconds
	return `${minutes}:${secondsText}`
}

function formatPercTime(perc: number, duration: number) {
	const time = (perc / 100) * duration
	return formatTime(time)
}

export default function VideoControls({
	duration,
	player,
	seekTo,
	qualities,
	currentQuality,
	changeQuality,
	changeSpeed,
	buffer,
	isFullscreen,
	toggleFullscreen,
	closeFullscreen,
	shouldKeepControlsVisible,
	volume,
	isMuted,
	onVolumeChange,
	onToggleMute,
}: Readonly<VideoProgressBarProps>) {
	const { currentTime, playerState, isInFocus, currentSpeed, isBuffering } =
		useAppSelector((state) => state.player)
	const playerControls = useRef<HTMLDivElement>(null)
	const [currentTimeText, setCurrentTimeText] = useState(
		formatPercTime(currentTime, duration),
	)
	const durationText = useMemo(() => formatTime(duration), [duration])
	const [isHovering, setIsHovering] = useState(false)
	const progressBar = useRef<HTMLDivElement>(null)
	const HoverPercentage = useRef(0)
	const isDragging = useRef(false)
	const isDragged = useRef(false)
	const [isOptionsOpen, setIsOptionsOpen] = useState(false)
	const isOptionsOpenRef = useRef(isOptionsOpen)
	const availableSpeeds: number[] = [0.25, 0.5, 1, 1.25, 1.5, 2]

	const [currentOptionMenu, setCurrentOptionMenu] = useState<
		"speed" | "quality" | "main"
	>("main")
	const iconCircle = useRef<HTMLDivElement>(null)
	const isAnimating = useRef(false)
	const isProgressBarHovering = useRef(false)

	const getCursorPosition = useCallback((e: MouseEvent) => {
		if (!progressBar.current) return 0
		const rect = progressBar.current.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const percentage = Math.min(Math.max(0, (offsetX / rect.width) * 100), 100)
		return percentage
	}, [])
	const seek = useCallback(
		(inputSeconds?: number) => {
			const seconds = inputSeconds ?? (HoverPercentage.current / 100) * duration
			if (player) {
				seekTo(seconds)
			}
		},
		[duration, player, seekTo],
	)
	const keepControlsVisible = useCallback(
		(force?: boolean) => {
			if (
				isProgressBarHovering.current ||
				isDragging.current ||
				isOptionsOpenRef.current ||
				force
			) {
				shouldKeepControlsVisible.current = true
			} else {
				shouldKeepControlsVisible.current = false
			}
		},
		[shouldKeepControlsVisible],
	)

	const closeOpenedOptions = () => {
		if (isOptionsOpenRef.current) {
			setIsOptionsOpen(false)
			isOptionsOpenRef.current = false
			setCurrentOptionMenu("main")
		}
	}

	// update percentage on mouse hover
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			const percentage = getCursorPosition(e)
			HoverPercentage.current = percentage
			setCurrentTimeText(formatPercTime(percentage, duration))
			setIsHovering(true)
			if (isDragging.current) {
				seek()
			}
		},
		[duration, getCursorPosition, seek],
	)

	function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation()
		isProgressBarHovering.current = false
		if (!isDragging.current) {
			setIsHovering(false)
		}
		keepControlsVisible()
	}

	function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation()
		isDragging.current = true
		isDragged.current = true
		const nativeEvent = e.nativeEvent
		handleMouseMove(nativeEvent)
		closeOpenedOptions()
		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("mouseup", handleMouseUp)
	}

	const handleMouseUp = useCallback(() => {
		setIsHovering(false)
		isDragging.current = false
		window.removeEventListener("mousemove", handleMouseMove)
		window.removeEventListener("mouseup", handleMouseUp)
		seek()
	}, [handleMouseMove, seek])

	const handleMoseOver = useCallback(() => {
		isProgressBarHovering.current = true
		keepControlsVisible()
	}, [keepControlsVisible])

	const toggleAnimation = useCallback(() => {
		if (!iconCircle.current) return

		if (isAnimating.current) {
			iconCircle.current.classList.remove("animate")
			iconCircle.current.style.animation = "none"
			isAnimating.current = false

			setTimeout(() => {
				if (!iconCircle.current) return
				iconCircle.current.style.animation = ""
				iconCircle.current.classList.add("animate")
				isAnimating.current = true
			}, 50)
		} else {
			iconCircle.current.style.animation = ""
			iconCircle.current.classList.add("animate")
			isAnimating.current = true
		}
	}, [])

	const playPause = useCallback(() => {
		if (playerState === PlayerState.PLAYING) {
			player?.pause()
		} else {
			player?.play()
		}
		toggleAnimation()
	}, [player, playerState, toggleAnimation])

	function seekBackward() {
		if (player) seek(Math.max(player.currentTime - 5, 0))
	}
	function seekForward() {
		if (player) seek(Math.min(player.currentTime + 5, duration))
	}

	const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false)
	const volumeSliderRef = useRef<HTMLDivElement>(null)
	const [isDraggingVolume, setIsDraggingVolume] = useState(false)

	const handleVolumeMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!volumeSliderRef.current) return
			const rect = volumeSliderRef.current.getBoundingClientRect()
			const offsetX = e.clientX - rect.left
			const percentage = Math.min(Math.max(0, (offsetX / rect.width) * 100), 100)
			onVolumeChange(percentage / 100)
		},
		[onVolumeChange]
	)

	const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		setIsDraggingVolume(true)
		handleVolumeMouseMove(e.nativeEvent)
		window.addEventListener("mousemove", handleVolumeMouseMove)
		window.addEventListener("mouseup", handleVolumeMouseUp)
	}

	const handleVolumeMouseUp = useCallback(() => {
		setIsDraggingVolume(false)
		window.removeEventListener("mousemove", handleVolumeMouseMove)
		window.removeEventListener("mouseup", handleVolumeMouseUp)
	}, [handleVolumeMouseMove])

	function handleKeydown(e: KeyboardEvent) {
		if (!playerControls.current) return
		if (!isInFocus) return
		switch (e.key) {
			case "ArrowRight":
			case "j":
			case "J":
				e.preventDefault()
				seekForward()
				break
			case "ArrowLeft":
			case "l":
			case "L":
				e.preventDefault()
				seekBackward()
				break
			case " ":
			case "Space":
			case "k":
			case "K":
				e.preventDefault()
				playPause()
				break
			case "f":
			case "F":
				e.preventDefault()
				toggleFullscreen()
				break
			case "o":
				e.preventDefault()
				setIsOptionsOpen(true)
				isOptionsOpenRef.current = true
				break
			case "m":
			case "M":
				e.preventDefault()
				onToggleMute()
				break
			case "ArrowUp":
				e.preventDefault()
				onVolumeChange(Math.min(volume + 0.1, 1))
				break
			case "ArrowDown":
				e.preventDefault()
				onVolumeChange(Math.max(volume - 0.1, 0))
				break
		}
	}

	function handleExitFullScreen() {
		closeFullscreen()
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeydown)
		document.addEventListener("fullscreenchange", handleExitFullScreen)

		return () => {
			document.removeEventListener("keydown", handleKeydown)
			document.removeEventListener("fullscreenchange", handleExitFullScreen)
		}
	})

	const goBackOption = useMemo(
		() => (
			<li
				onClick={(e) => {
					e.stopPropagation()
					setCurrentOptionMenu("main")
				}}
				className="flex items-center gap-2 cursor-pointer"
				role="menuitem"
				aria-roledescription="menuitem"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault()
						setCurrentOptionMenu("main")
					}
				}}
			>
				<IoChevronBackSharp /> Indietro
			</li>
		),
		[],
	)

	const setVideoQuality = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		quality: string,
	) => {
		e.stopPropagation()
		changeQuality(quality)
		setIsOptionsOpen(false)
		isOptionsOpenRef.current = false
		setCurrentOptionMenu("main")
	}

	const setVideoSpeed = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		speed: number,
	) => {
		e.stopPropagation()
		changeSpeed(speed)
		setIsOptionsOpen(false)
		isOptionsOpenRef.current = false
		setCurrentOptionMenu("main")
	}

	const VolumeIcon = useMemo(() => {
		if (isMuted || volume === 0) return IoVolumeMute
		if (volume < 0.33) return IoVolumeLow
		if (volume < 0.66) return IoVolumeMedium
		return IoVolumeHigh
	}, [volume, isMuted])

	return (
		<>
			<div className="center-wrapper">
				<div className="icon-circle-wrapper">
					<div
						className="icon-circle"
						ref={iconCircle}
						onAnimationEnd={() => {
							iconCircle.current?.classList.remove("animate")
							isAnimating.current = false
						}}
					>
						{playerState === PlayerState.PLAYING ? <PlayIcon /> : <PauseIcon />}
					</div>
				</div>
				{isBuffering && <div className="loader" />}
			</div>
			<div
				ref={playerControls}
				className="player-controls"
				style={{
					height: isDragging.current ? "100%" : "",
					opacity: isDragging.current ? 1 : "",
					cursor: "default",
				}}
				onClick={() => {
					if (!isDragged.current && !isOptionsOpenRef.current) {
						playPause()
					}
					closeOpenedOptions()
					isDragged.current = false
				}}
				onDoubleClick={(e) => {
					e.stopPropagation()
					toggleFullscreen()
				}}
			>
				<div
					className="progress-bar-wrapper"
					onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
					onMouseLeave={handleMouseLeave}
					onMouseDown={handleMouseDown}
					onMouseOver={handleMoseOver}
					ref={progressBar}
					style={{ opacity: isDragging.current ? 1 : "" }}
					aria-roledescription="progressbar"
					role="slider"
					tabIndex={0}
					aria-valuemin={0}
					aria-valuemax={duration}
					aria-valuenow={currentTime}
					aria-valuetext={currentTimeText}
					aria-label={`${currentTimeText}/${durationText}`}
				>
					<div className="buffer-wrapper">
						{buffer.map(({ left, width }) => (
							<div
								key={left}
								className="buffer-slice"
								style={{
									left: `${left}`,
									width: `${width}`,
								}}
							/>
						))}
					</div>
					<div
						className={`circle${isHovering || isDragging.current ? " active" : ""}`}
						style={{ left: `${(currentTime / duration) * 100}%` }}
					/>
					<div
						className="progress"
						style={{ width: `${(currentTime / duration) * 100}%` }}
					/>
					<div
						className="h-full bg-white/30"
						style={{
							width: `${HoverPercentage.current}%`,
							visibility: isHovering ? "visible" : "hidden",
						}}
					/>

					<div
						className="time-hover-text"
						style={{
							left: `${HoverPercentage.current}%`,
							visibility: isHovering ? "visible" : "hidden",
						}}
					>
						{currentTimeText}
					</div>
				</div>
				<div className="controls text-white">
					<div className="left">
						<button
							onClick={(e) => {
								e.stopPropagation()
								seekBackward()
								closeOpenedOptions()
							}}
							className="text-xl"
							onDoubleClick={(e) => {
								e.stopPropagation()
							}}
							onMouseOver={() => {
								keepControlsVisible(true)
							}}
							onMouseLeave={() => {
								keepControlsVisible(false)
							}}
						>
							<IoChevronBackSharp /> 5s
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								playPause()
								closeOpenedOptions()
							}}
							className="text-3xl"
							onDoubleClick={(e) => {
								e.stopPropagation()
							}}
							onMouseOver={() => {
								keepControlsVisible(true)
							}}
							onMouseLeave={() => {
								keepControlsVisible(false)
							}}
						>
							{playerState === PlayerState.PLAYING ? (
								<IoPauseSharp />
							) : (
								<IoPlaySharp />
							)}
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								seekForward()
								closeOpenedOptions()
							}}
							className="text-xl"
							onDoubleClick={(e) => {
								e.stopPropagation()
							}}
							onMouseOver={() => {
								keepControlsVisible(true)
							}}
							onMouseLeave={() => {
								keepControlsVisible(false)
							}}
						>
							5s <IoChevronForwardSharp />
						</button>
						<div
							className="volume-control relative"
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className="volume-control-wrapper flex items-center"
								onMouseEnter={() => setIsVolumeSliderVisible(true)}
								onMouseLeave={() => !isDraggingVolume && setIsVolumeSliderVisible(false)}
								onClick={(e) => e.stopPropagation()}
							>
								<button
									className="text-xl"
									onClick={(e) => {
										e.stopPropagation()
										onToggleMute()
									}}
									onDoubleClick={(e) => e.stopPropagation()}
									onMouseOver={() => keepControlsVisible(true)}
									onMouseLeave={() => keepControlsVisible(false)}
								>
									<VolumeIcon />
								</button>
								<div
									className={`volume-slider-container ml-2 overflow-hidden transition-all duration-200 ease-out  ${
										isVolumeSliderVisible || isDraggingVolume ? "w-12 px-2 -mx-2" : "w-0 px-0"
									}`}
									onClick={(e) => e.stopPropagation()}
								>
									<div
										ref={volumeSliderRef}
										className="volume-slider h-1 bg-white/30 relative cursor-pointer rounded-full"
										onClick={(e) => {
											e.stopPropagation()
											handleVolumeMouseMove(e.nativeEvent)
										}}
										onMouseDown={(e) => {
											e.stopPropagation()
											handleVolumeMouseDown(e)
										}}
									>
										<div
											className="absolute left-0 h-full bg-primary rounded-full"
											style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
										/>
										<div
											className="absolute w-3 h-3 bg-primary rounded-full top-1/2 -translate-y-1/2"
											style={{
												left: `${(isMuted ? 0 : volume) * 100}%`,
												transform: 'translate(-50%, -50%)'
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div>
							{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>
					<div className="right">
						
						<button
							className="text-xl"
							onClick={(e) => {
								e.stopPropagation()
								setIsOptionsOpen(!isOptionsOpen)
								isOptionsOpenRef.current = !isOptionsOpenRef.current
								setCurrentOptionMenu("main")
								keepControlsVisible()
							}}
							onDoubleClick={(e) => {
								e.stopPropagation()
							}}
							onMouseOver={() => {
								keepControlsVisible(true)
							}}
							onMouseLeave={() => {
								keepControlsVisible(false)
							}}
						>
							<IoSettingsSharp />
						</button>
						<button
							className="text-xl"
							onClick={(e) => {
								e.stopPropagation()
								toggleFullscreen()
								closeOpenedOptions()
							}}
							onMouseOver={() => {
								keepControlsVisible(true)
							}}
							onMouseLeave={() => {
								keepControlsVisible(false)
							}}
						>
							{isFullscreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
