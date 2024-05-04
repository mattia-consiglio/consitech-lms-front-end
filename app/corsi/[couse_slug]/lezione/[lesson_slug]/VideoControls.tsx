import React, { useEffect, useRef, useState } from 'react'
import {
	IoChevronBackSharp,
	IoChevronForwardSharp,
	IoPauseSharp,
	IoPlaySharp,
} from 'react-icons/io5'
import { YouTubePlayer } from 'react-youtube'

interface VideoProgressBarProps {
	duration: number
	currentTime: number
	player: YouTubePlayer
	setCurrentTime: (time: number) => void
	playerState: number
}

export default function VideoControls({
	duration,
	currentTime,
	player,
	setCurrentTime,
	playerState,
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
	const [currentTimeText, setCurrentTimeText] = useState(formatPercTime(currentTime))
	const [isHovering, setIsHovering] = useState(false)
	const progressBar = useRef<HTMLDivElement>(null)
	const HoverPercentage = useRef(0)
	const isDragging = useRef(false)

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
			console.log('drag', isDragging.current)
			seek()
		}
		// console.log('handleMouseMove', isHoveringRef.current)
	}

	const handleMouseLeave = () => {
		if (!isDragging.current) {
			console.log('handleMouseLeave in')
			// isHoveringRef.current = false
			setIsHovering(false)
		}
		// console.log('handleMouseLeave end', isHoveringRef.current)
	}

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		isDragging.current = true
		const nativeEvent = e.nativeEvent as MouseEvent
		handleMouseMove(nativeEvent)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	const handleMouseUp = () => {
		// isHoveringRef.current = false
		setIsHovering(false)
		isDragging.current = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
		seek()
	}

	const seek = (seconds?: number) => {
		seconds = seconds !== undefined ? seconds : (HoverPercentage.current / 100) * duration
		if (player) {
			player.seekTo(seconds)
			setCurrentTime(seconds)
		}
	}

	const playPause = () => {
		if (player) {
			if (player.getPlayerState() === 1) {
				player.pauseVideo()
				setCurrentTime(player.getCurrentTime())
				seek(player.getCurrentTime())
			} else {
				setCurrentTime(player.getCurrentTime())
				seek(player.getCurrentTime())
				player.playVideo()
			}
		}
	}

	return (
		<div
			className='player-controls'
			style={{
				height: isDragging.current ? '100%' : '',
				opacity: isDragging.current ? 1 : '',
				cursor: 'default',
			}}
			onClick={e => {
				playPause()
			}}
		>
			<div
				className='progress-bar-wrapper'
				onMouseMove={e => handleMouseMove(e.nativeEvent)}
				onMouseLeave={handleMouseLeave}
				onMouseDown={handleMouseDown}
				ref={progressBar}
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
			<div className='controls'>
				<div className='left'>
					<button
						onClick={e => {
							e.stopPropagation()
							seek(player.getCurrentTime() - 5)
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
						{playerState === 1 ? <IoPauseSharp /> : <IoPlaySharp />}
					</button>
					<button
						onClick={e => {
							e.stopPropagation()
							seek(player.getCurrentTime() + 5)
						}}
						className='text-xl'
					>
						5s <IoChevronForwardSharp />
					</button>
					<div>
						{formatTime(currentTime)} / {formatTime(duration)}
					</div>
				</div>
			</div>
		</div>
	)
}
