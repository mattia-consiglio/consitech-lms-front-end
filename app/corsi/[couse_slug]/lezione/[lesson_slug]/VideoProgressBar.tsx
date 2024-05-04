import React, { useEffect, useRef, useState } from 'react'

interface VideoProgressBarProps {
	duration: number
	currentTime: number
	onSeek: (percentage: number) => void
}

export default function VideoProgressBar({ duration, currentTime, onSeek }: VideoProgressBarProps) {
	const [currentTimeText, setCurrentTimeText] = useState(formatTime(currentTime))
	// const [hoverPercentage, setHoverPercentage] = useState(0)
	// const [isHovering, setIsHovering] = useState(false)
	// const [isDragging, setIsDragging] = useState(false)
	const progressBarRef = useRef<HTMLDivElement>(null)
	const percentageRef = useRef(0)
	const isDraggingRef = useRef(false)
	const isHovering = useRef(false)

	function formatTime(perc: number) {
		const time = (perc / 100) * duration
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	function getCursorPosition(e: MouseEvent) {
		if (!progressBarRef.current) return 0
		const rect = progressBarRef.current.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const percentage = (offsetX / rect.width) * 100
		return percentage
	}

	// update percentage on mouse hover

	const handleMouseMove = (e: MouseEvent) => {
		// console.log('move', isDragging)

		const percentage = getCursorPosition(e)
		percentageRef.current = percentage
		// setHoverPercentage(percentage)
		setCurrentTimeText(formatTime(percentage))
		// setIsHovering(true)
		isHovering.current = true
		if (isDraggingRef.current) {
			console.log('drag', isDraggingRef.current)
			// setHoverPercentage(percentage)
			seek()
		}
	}

	const handleMouseLeave = () => {
		if (!isDraggingRef) {
			// setIsHovering(false)
			isHovering.current = false
		}
	}

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// console.warn('down', isDraggingRef)
		// setIsDragging(true)
		isDraggingRef.current = true
		const nativeEvent = e.nativeEvent as MouseEvent
		handleMouseMove(nativeEvent)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	const handleMouseUp = () => {
		console.warn('up', isDraggingRef.current)
		// setIsDragging(false)
		// setIsHovering(false)
		isHovering.current = false
		isDraggingRef.current = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
		seek()
	}

	const seek = () => {
		console.log(percentageRef.current)
		const seconds = (percentageRef.current / 100) * duration
		onSeek(seconds)
	}

	return (
		<div className='player-controls' style={{ height: isDraggingRef.current ? '100%' : '0%' }}>
			<div
				className='progress-bar-wrapper'
				onMouseMove={e => handleMouseMove(e.nativeEvent)}
				onMouseLeave={handleMouseLeave}
				onMouseDown={handleMouseDown}
				ref={progressBarRef}
			>
				<div className='circle' style={{ left: `${(currentTime / duration) * 100}%` }}></div>
				<div className='progress' style={{ width: `${(currentTime / duration) * 100}%` }} />
				<div
					className='time-hover-text'
					style={{
						left: `${percentageRef.current}%`,
						visibility: isHovering.current ? 'visible' : 'hidden',
					}}
				>
					{currentTimeText}
				</div>
				<h1>{isHovering.current ? 'true' : 'false'}</h1>
			</div>
		</div>
	)
}
