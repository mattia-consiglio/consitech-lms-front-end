import React, { useEffect, useState } from 'react'
import './videoPlayer.scss'

interface VideoProgressBarProps {
	duration: number
	currentTime: number
	onSeek: (percentage: number) => void
}

export default function VideoProgressBar({ duration, currentTime, onSeek }: VideoProgressBarProps) {
	const [currentTimeText, setCurrentTimeText] = useState(formatTime(currentTime))
	const [hoverPercentage, setHoverPercentage] = useState(0)
	const [isHovering, setIsHovering] = useState(false)

	function formatTime(perc: number) {
		const time = (perc / 100) * duration
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	function getCursorPosition(e: React.MouseEvent<HTMLDivElement>) {
		const target = e.currentTarget.closest('.progress-bar-wrapper') as HTMLDivElement
		const percentage =
			(e.nativeEvent.offsetX / (e.currentTarget as HTMLDivElement).offsetWidth) * 100
		return percentage
	}

	// update percentage on mouse hover

	const handleMouseHover = (e: React.MouseEvent<HTMLDivElement>) => {
		const percentage = getCursorPosition(e)
		setHoverPercentage(percentage)
		setCurrentTimeText(formatTime(percentage))
		setIsHovering(true)
	}
	const handleMouseLeave = () => {
		setIsHovering(false)
	}

	return (
		<div
			className='progress-bar-wrapper'
			onMouseMove={handleMouseHover}
			onMouseOver={handleMouseHover}
			onMouseLeave={handleMouseLeave}
			onClick={() => {
				const seconds = (hoverPercentage / 100) * duration
				onSeek(seconds)
			}}
		>
			<div className='progress' style={{ width: `${(currentTime / duration) * 100}%` }} />
			<div className='circle' style={{ left: `${(currentTime / duration) * 100}%` }}></div>
			{/* <div className='time-text'>{currentTimeText}</div> */}
			<div
				className='time-hover-text'
				style={{
					left: `${hoverPercentage}%`,
					visibility: isHovering ? 'visible' : 'hidden',
				}}
			>
				{currentTimeText}
			</div>
		</div>
	)
}
