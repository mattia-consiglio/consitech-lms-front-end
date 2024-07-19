import { useAppDispatch, useAppSelector } from '@/redux/store'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	IoChevronBackSharp,
	IoChevronForwardSharp,
	IoLogoClosedCaptioning,
	IoPauseSharp,
	IoPlaySharp,
	IoSettingsSharp,
} from 'react-icons/io5'
import { MdFullscreen, MdOutlineCheck, MdOutlineFullscreenExit } from 'react-icons/md'
import { BufferStyle, PlayerState } from './VideoPlayer'

interface VideoProgressBarProps {
	duration: number
	player: HTMLVideoElement | null
	playerWrapper: React.RefObject<HTMLDivElement>
	isPlayedOnce: boolean
	seekTo: (time: number) => void
	qualities: string[] | null
	setCurrentQuality: (quality: string) => void
	currentQuality: string
	changeQuality: (quality: string) => void
	changeSpeed: (speed: number) => void
	buffer: BufferStyle[]
}

function PlayIcon() {
	return (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			xmlns='http://www.w3.org/2000/svg'
			height='1em'
			width='1em'
			viewBox='0 0 79 79'
		>
			<polygon points='73.71 39.5 5.29 0 5.29 79 73.71 39.5' />
		</svg>
	)
}

function PauseIcon() {
	return (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			height='1em'
			width='1em'
			viewBox='0 0 79 79'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g>
				<rect x='5' width='24' height='79' />
				<rect x='50.5' width='24' height='79' />
			</g>
		</svg>
	)
}

function formatTime(time: number) {
	const minutes = Math.floor(time / 60)
	let seconds = Math.floor(time % 60)
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
	playerWrapper,
	isPlayedOnce,
	seekTo,
	qualities,
	setCurrentQuality,
	currentQuality,
	changeQuality,
	changeSpeed,
	buffer,
}: Readonly<VideoProgressBarProps>) {
	const { currentTime, playerState, isInFocus, currentSpeed, isBuffering } = useAppSelector(
		state => state.player
	)
	const playerControls = useRef<HTMLDivElement>(null)
	const [currentTimeText, setCurrentTimeText] = useState(formatPercTime(currentTime, duration))
	const durationText = useMemo(() => formatTime(duration), [duration])
	const [isHovering, setIsHovering] = useState(false)
	const progressBar = useRef<HTMLDivElement>(null)
	const HoverPercentage = useRef(0)
	const isDragging = useRef(false)
	const isDragged = useRef(false)
	const [isOptionsOpen, setIsOptionsOpen] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const availableSpeeds: number[] = [0.25, 0.5, 1, 1.25, 1.5, 2]

	const [currentOptionMenu, setCurrentOptionMenu] = useState<'speed' | 'quality' | 'main'>('main')
	const iconCircle = useRef<HTMLDivElement>(null)
	const isAnimating = useRef(false)

	function getCursorPosition(e: MouseEvent) {
		if (!progressBar.current) return 0
		const rect = progressBar.current.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const percentage = Math.min(Math.max(0, (offsetX / rect.width) * 100), 100)
		return percentage
	}

	// update percentage on mouse hover
	function handleMouseMove(e: MouseEvent) {
		const percentage = getCursorPosition(e)
		HoverPercentage.current = percentage
		setCurrentTimeText(formatPercTime(percentage, duration))
		setIsHovering(true)
		if (isDragging.current) {
			seek()
		}
	}

	function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation()
		if (!isDragging.current) {
			setIsHovering(false)
		}
	}

	function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation()
		isDragging.current = true
		isDragged.current = true
		const nativeEvent = e.nativeEvent
		handleMouseMove(nativeEvent)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseUp() {
		setIsHovering(false)
		isDragging.current = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
		seek()
	}

	function seek(seconds?: number) {
		seconds = seconds ?? (HoverPercentage.current / 100) * duration
		if (player) {
			seekTo(seconds)
		}
	}

	function toggleAnimation() {
		if (!iconCircle.current) return

		if (isAnimating.current) {
			iconCircle.current.classList.remove('animate')
			iconCircle.current.style.animation = 'none'
			isAnimating.current = false

			setTimeout(() => {
				if (!iconCircle.current) return
				iconCircle.current.style.animation = ''
				iconCircle.current.classList.add('animate')
				isAnimating.current = true
			}, 50)
		} else {
			iconCircle.current.style.animation = ''
			iconCircle.current.classList.add('animate')
			isAnimating.current = true
		}
	}

	const playPause = useCallback(() => {
		if (playerState === PlayerState.PLAYING) {
			player?.pause()
		} else {
			player?.play()
		}
		toggleAnimation()
	}, [player, playerState])

	const openFullscreen = useCallback(() => {
		playerWrapper.current?.requestFullscreen()
		setIsFullscreen(true)
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
	useEffect(() => {
		if (isPlayedOnce && player) {
			if (qualities?.length) {
				setCurrentQuality(qualities[0])
			}
		}
	}, [isPlayedOnce, player, qualities, setCurrentQuality])

	function seekBackward() {
		player && seek(Math.max(player.currentTime - 5, 0))
	}
	function seekForward() {
		player && seek(Math.min(player.currentTime + 5, duration))
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!playerControls.current) return
		if (!isInFocus) return
		switch (e.key) {
			case 'ArrowRight':
			case 'j':
			case 'J':
				e.preventDefault()
				seekForward()
				break
			case 'ArrowLeft':
			case 'l':
			case 'L':
				e.preventDefault()
				seekBackward()
				break
			case ' ':
			case 'Space':
			case 'k':
			case 'K':
				e.preventDefault()
				playPause()
				break
			case 'f':
			case 'F':
				e.preventDefault()
				toggleFullscreen()
				break
			case 'o':
				e.preventDefault()
				setIsOptionsOpen(true)
				break
		}
	}

	function handleExitFullScreen() {
		closeFullscreen()
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown)
		document.addEventListener('fullscreenchange', handleExitFullScreen)

		return () => {
			document.removeEventListener('keydown', handleKeydown)
			document.removeEventListener('fullscreenchange', handleExitFullScreen)
		}
	})

	const goBackOption = useMemo(
		() => (
			<li
				onClick={e => {
					e.stopPropagation()
					setCurrentOptionMenu('main')
				}}
				className='flex items-center gap-2 cursor-pointer'
				role='menuitem'
				aria-roledescription='menuitem'
				tabIndex={0}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setCurrentOptionMenu('main')
					}
				}}
			>
				<IoChevronBackSharp /> Indietro
			</li>
		),
		[]
	)

	const setVideoQuality = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, quality: string) => {
		e.stopPropagation()
		changeQuality(quality)
		setIsOptionsOpen(false)
		setCurrentOptionMenu('main')
	}

	const setVideoSpeed = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, speed: number) => {
		e.stopPropagation()
		changeSpeed(speed)
		setIsOptionsOpen(false)
		setCurrentOptionMenu('main')
	}

	return (
		<>
			<div className='center-wrapper'>
				<div className='icon-circle-wrapper'>
					<div
						className='icon-circle'
						ref={iconCircle}
						onAnimationEnd={() => {
							iconCircle.current?.classList.remove('animate')
							isAnimating.current = false
						}}
					>
						{playerState === PlayerState.PLAYING ? <PlayIcon /> : <PauseIcon />}
					</div>
				</div>
				{isBuffering && <div className='loader' />}
			</div>
			<div
				ref={playerControls}
				className='player-controls'
				style={{
					height: isDragging.current ? '100%' : '',
					opacity: isDragging.current ? 1 : '',
					cursor: 'default',
				}}
				onClick={() => {
					if (!isDragged.current) {
						playPause()
					}
					isDragged.current = false
				}}
				onDoubleClick={e => {
					e.stopPropagation()
					toggleFullscreen()
				}}
			>
				<div
					className='progress-bar-wrapper'
					onMouseMove={e => handleMouseMove(e.nativeEvent)}
					onMouseLeave={handleMouseLeave}
					onMouseDown={handleMouseDown}
					ref={progressBar}
					style={{ opacity: isDragging.current ? 1 : '' }}
					aria-roledescription='progressbar'
					role='slider'
					tabIndex={0}
					aria-valuemin={0}
					aria-valuemax={duration}
					aria-valuenow={currentTime}
					aria-valuetext={currentTimeText}
					aria-label={`${currentTimeText}/${durationText}`}
				>
					<div className='buffer-wrapper'>
						{buffer.map(({ left, width }) => (
							<div
								key={left}
								className='buffer-slice'
								style={{
									left: `${left}`,
									width: `${width}`,
								}}
							/>
						))}
					</div>
					<div
						className={`circle${isHovering || isDragging.current ? ' active' : ''}`}
						style={{ left: `${(currentTime / duration) * 100}%` }}
					></div>
					<div className='progress' style={{ width: `${(currentTime / duration) * 100}%` }} />
					<div
						className='h-full bg-white/30'
						style={{
							width: `${HoverPercentage.current}%`,
							visibility: isHovering ? 'visible' : 'hidden',
						}}
					></div>

					<div
						className='time-hover-text'
						style={{
							left: `${HoverPercentage.current}%`,
							visibility: isHovering ? 'visible' : 'hidden',
						}}
					>
						{currentTimeText}
					</div>
				</div>
				<div className='controls text-white'>
					<div className='left'>
						<button
							onClick={e => {
								e.stopPropagation()
								player && seek(Math.max(player.currentTime - 5, 0))
							}}
							className='text-xl'
							onDoubleClick={e => {
								e.stopPropagation()
							}}
						>
							<IoChevronBackSharp /> 5s
						</button>
						<button
							onClick={e => {
								e.stopPropagation()
								playPause()
							}}
							className='text-3xl'
							onDoubleClick={e => {
								e.stopPropagation()
							}}
						>
							{playerState === PlayerState.PLAYING ? <IoPauseSharp /> : <IoPlaySharp />}
						</button>
						<button
							onClick={e => {
								e.stopPropagation()
								player && seek(Math.min(player.currentTime + 5, duration))
							}}
							className='text-xl'
							onDoubleClick={e => {
								e.stopPropagation()
							}}
						>
							5s <IoChevronForwardSharp />
						</button>
						<div>
							{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>
					<div className='right'>
						<button
							onClick={e => {
								e.stopPropagation()
							}}
						>
							{/* <IoLogoClosedCaptioning /> */}
						</button>
						<div className='flex items-center relative gap-2'>
							<div
								className={`options-menu absolute bottom-7 bg-neutral-800 right-0${
									isOptionsOpen ? ' block' : ' hidden'
								}`}
								role='menu'
							>
								{currentOptionMenu === 'main' && (
									<ul
										tabIndex={0}
										role='menu'
										aria-label='Opzioni'
										aria-orientation='vertical'
										aria-hidden={isOptionsOpen}
									>
										{/* <li>Sottotitoli</li> */}
										<li
											onClick={e => {
												e.stopPropagation()
												setCurrentOptionMenu('speed')
											}}
											role='menuitem'
											tabIndex={0}
											onKeyDown={e => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													setCurrentOptionMenu('speed')
												}
											}}
										>
											Velocità riproduzione
										</li>
										<li
											onClick={e => {
												e.stopPropagation()
												setCurrentOptionMenu('quality')
											}}
											role='menuitem'
											tabIndex={0}
											onKeyDown={e => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													setCurrentOptionMenu('quality')
												}
											}}
										>
											Qualità
										</li>
									</ul>
								)}
								{currentOptionMenu === 'quality' && (
									<ul>
										{goBackOption}
										{qualities?.map(quality => (
											<li
												key={quality}
												className={`flex items-center${
													currentQuality === quality
														? ' justify-between text-primary'
														: ' justify-end'
												}`}
												onClick={e => setVideoQuality(e, quality)}
												role='menuitem'
												tabIndex={0}
												onKeyDown={e => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault()
														setVideoQuality(e as any, quality)
													}
												}}
											>
												{currentQuality === quality && <MdOutlineCheck />}
												{quality}
											</li>
										))}
									</ul>
								)}
								{currentOptionMenu === 'speed' && (
									<ul>
										{goBackOption}
										{availableSpeeds.map(speed => (
											<li
												key={'videoSpeed_' + speed}
												className={`flex items-center${
													currentSpeed === speed ? ' justify-between text-primary' : ' justify-end'
												}`}
												onClick={e => setVideoSpeed(e, speed)}
												role='menuitem'
												tabIndex={0}
												onKeyDown={e => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault()
														setVideoSpeed(e as any, speed)
													}
												}}
											>
												{currentSpeed === speed ? <MdOutlineCheck /> : <div />}
												{speed + 'x'}
											</li>
										))}
									</ul>
								)}
							</div>
							<button
								className='text-xl'
								onClick={e => {
									e.stopPropagation()
									setIsOptionsOpen(!isOptionsOpen)
									setCurrentOptionMenu('main')
								}}
								onDoubleClick={e => {
									e.stopPropagation()
								}}
							>
								<IoSettingsSharp />
							</button>
							<button
								className='text-xl'
								onClick={e => {
									e.stopPropagation()
									toggleFullscreen()
								}}
							>
								{isFullscreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
