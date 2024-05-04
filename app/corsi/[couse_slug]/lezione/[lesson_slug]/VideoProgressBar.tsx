import React, { useEffect, useRef, useState } from 'react'

interface VideoProgressBarProps {
	duration: number
	currentTime: number
	onSeek: (percentage: number) => void
}

export default function VideoProgressBar({ duration, currentTime, onSeek }: VideoProgressBarProps) {
	const [currentTimeText, setCurrentTimeText] = useState(formatTime(currentTime))
	const [isHovering, setIsHovering] = useState(false)
	const progressBar = useRef<HTMLDivElement>(null)
	const HoverPercentage = useRef(0)
	const isDragging = useRef(false)
	// const isHoveringRef = useRef(false)

	function formatTime(perc: number) {
		const time = (perc / 100) * duration
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	function getCursorPosition(e: MouseEvent) {
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
		setCurrentTimeText(formatTime(percentage))
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

	const seek = () => {
		const seconds = (HoverPercentage.current / 100) * duration
		onSeek(seconds)
	}

	return (
		<div
			className='player-controls'
			style={{ height: isDragging.current ? '100%' : '0%', cursor: 'default' }}
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
		</div>
	)
}
