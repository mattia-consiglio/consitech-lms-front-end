import { setCurrentTime } from '@/redux/reducers/playerReducer'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import {
	IoChevronBackSharp,
	IoChevronForwardSharp,
	IoLogoClosedCaptioning,
	IoPauseSharp,
	IoPlaySharp,
	IoSettingsSharp,
} from 'react-icons/io5'
import { YouTubePlayer } from 'react-youtube'
import { MdFullscreen, MdOutlineCheck, MdOutlineFullscreenExit } from 'react-icons/md'
import { PlayerState } from './VideoPlayer'

interface VideoProgressBarProps {
	duration: number
	player: HTMLVideoElement
	// playerState: number
	playerWrapper: React.RefObject<HTMLDivElement>
	isPlayedOnce: boolean
	seekTo: (time: number) => void
	qualities: string[] | null
	setCurrentQuality: (quality: string) => void
	currentQuality: string
	changeQuality: (quality: string) => void
}

export default function VideoControls({
	duration,
	player,
	// playerState,
	playerWrapper,
	isPlayedOnce,
	seekTo,
	qualities,
	setCurrentQuality,
	currentQuality,
	changeQuality,
}: VideoProgressBarProps) {
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		let seconds = Math.floor(time % 60)
		const secondsText = seconds < 10 ? `0${seconds}` : seconds
		return `${minutes}:${secondsText}`
	}

	const formatPercTime = (perc: number) => {
		const time = (perc / 100) * duration
		return formatTime(time)
	}

	const { currentTime, playerState } = useAppSelector(state => state.player)
	const playerControls = useRef<HTMLDivElement>(null)
	const [currentTimeText, setCurrentTimeText] = useState(formatPercTime(currentTime))
	const [isHovering, setIsHovering] = useState(false)
	const progressBar = useRef<HTMLDivElement>(null)
	const HoverPercentage = useRef(0)
	const isDragging = useRef(false)
	const dispatch = useAppDispatch()
	const isDragged = useRef(false)
	const [isOptionsOpen, setIsOptionsOpen] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const availableSpeeds: number[] = [0.25, 0.5, 1, 1.25, 1.5, 2]
	const [currentSpeed, setCurrentSpeed] = useState(1)
	const [currentOptionMenu, setCurrentOptionMenu] = useState<'speed' | 'quality' | 'main'>('main')

	const getCursorPosition = (e: MouseEvent) => {
		if (!progressBar.current) return 0
		const rect = progressBar.current.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const percentage = Math.min(Math.max(0, (offsetX / rect.width) * 100), 100)
		return percentage
	}

	// update percentage on mouse hover

	const handleMouseMove = (e: MouseEvent) => {
		const percentage = getCursorPosition(e)
		HoverPercentage.current = percentage
		setCurrentTimeText(formatPercTime(percentage))
		// isHoveringRef.current = true
		setIsHovering(true)
		if (isDragging.current) {
			seek()
		}
	}

	const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (!isDragging.current) {
			setIsHovering(false)
		}
	}

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		isDragging.current = true
		isDragged.current = true
		const nativeEvent = e.nativeEvent as MouseEvent
		handleMouseMove(nativeEvent)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	const handleMouseUp = () => {
		setIsHovering(false)
		isDragging.current = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
		seek()
	}

	const seek = (seconds?: number) => {
		seconds = seconds !== undefined ? seconds : (HoverPercentage.current / 100) * duration
		if (player) {
			seekTo(seconds)
		}
	}

	const playPause = () => {
		console.log('playerState', playerState)
		if (player) {
			if (playerState === PlayerState.PLAYING) {
				player.pause()
				dispatch(setCurrentTime(player.currentTime))
				seek(player.currentTime)
			} else {
				dispatch(setCurrentTime(player.currentTime))
				seek(player.currentTime)
				player.play()
			}
		}
	}

	const toggleFullscreen = () => {
		if (document.fullscreenElement?.id === 'videoPlayerWrapper') {
			document.exitFullscreen()
			setIsFullscreen(false)
		} else {
			playerWrapper.current?.requestFullscreen()
			setIsFullscreen(true)
		}
	}

	useEffect(() => {
		if (isPlayedOnce && player) {
			if (qualities?.length) {
				setCurrentQuality(qualities[0])
			}
		}
	}, [isPlayedOnce, player, qualities, setCurrentQuality])

	const goBackOption = (
		<li
			onClick={e => {
				e.stopPropagation()
				setCurrentOptionMenu('main')
			}}
		>
			Indietro
		</li>
	)

	const setVideoQuality = (quality: string) => {
		// player.childNodes[0].setAttribute('src', quality)
		// console.log('setting quality', player.getPlaybackQuality())
		changeQuality(quality)
		setIsOptionsOpen(false)
	}

	return (
		<div
			ref={playerControls}
			className='player-controls'
			style={{
				height: isDragging.current ? '100%' : '',
				opacity: isDragging.current ? 1 : '',
				cursor: 'default',
			}}
			onClick={e => {
				if (!isDragged.current) {
					playPause()
				}
				isDragged.current = false
			}}
		>
			<div
				className='progress-bar-wrapper'
				onMouseMove={e => handleMouseMove(e.nativeEvent)}
				onMouseLeave={handleMouseLeave}
				onMouseDown={handleMouseDown}
				ref={progressBar}
				style={{ opacity: isDragging.current ? 1 : '' }}
			>
				<div
					className={`circle${isHovering || isDragging.current ? ' active' : ''}`}
					style={{ left: `${(currentTime / duration) * 100}%` }}
				></div>
				<div className='progress' style={{ width: `${(currentTime / duration) * 100}%` }} />
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
							seek(Math.max(player.currentTime - 5, 0))
						}}
						className='text-xl'
					>
						<IoChevronBackSharp /> 5s
					</button>
					<button
						onClick={e => {
							e.stopPropagation()
							playPause()
						}}
						className='text-3xl'
					>
						{playerState === PlayerState.PLAYING ? <IoPauseSharp /> : <IoPlaySharp />}
						{/* <IoPlaySharp /> */}
					</button>
					<button
						onClick={e => {
							e.stopPropagation()
							seek(Math.min(player.currentTime + 5, duration))
						}}
						className='text-xl'
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
						<IoLogoClosedCaptioning />
					</button>
					<div className='flex items-center relative'>
						<div
							className={`options-menu absolute bottom-4 bg-neutral-800 right-0${
								isOptionsOpen ? ' block' : ' hidden'
							}`}
						>
							{currentOptionMenu === 'main' && (
								<ul>
									<li>Sottotitoli</li>
									<li
										onClick={e => {
											e.stopPropagation()
											setCurrentOptionMenu('speed')
										}}
									>
										Velocità riproduzione
									</li>
									<li
										onClick={e => {
											e.stopPropagation()
											setCurrentOptionMenu('quality')
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
											className='flex justify-end items-center'
											onClick={e => {
												e.stopPropagation()
												setVideoQuality(quality)
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
										<li key={speed} className='flex justify-end items-center'>
											{currentSpeed === speed && <MdOutlineCheck />}
											{speed}x
										</li>
									))}
								</ul>
							)}
						</div>
						<button
							onClick={e => {
								e.stopPropagation()
								console.log('clicked', isOptionsOpen)

								setIsOptionsOpen(!isOptionsOpen)
							}}
						>
							<IoSettingsSharp />
						</button>
						<button
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
	)
}
