'use client'
import { Button } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import YouTube, { YouTubeEvent, YouTubePlayer, YouTubeProps } from 'react-youtube'
import VideoProgressBar from './VideoProgressBar'
import { customButtonTheme } from '@/app/flowbite.themes'
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5'
import { log } from 'console'
import './videoPlayer.scss'

interface VideoPlayerProps {
	videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
	const [player, setPlayer] = useState<YouTubePlayer | null>(null)
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout>()
	const [playerState, setPlayerState] = useState(-1)
	const onPlayerReady: YouTubeProps['onReady'] = event => {
		// access to player in all event handlers via event.target
		setPlayer(event.target)
		setDuration(event.target.getDuration())
		setCurrentTime(event.target.getCurrentTime())
	}

	const playPause = () => {
		if (player) {
			if (player.getPlayerState() === 1) {
				player.pauseVideo()
				setCurrentTime(player.getCurrentTime())
				seekTo(player.getCurrentTime())
			} else {
				setCurrentTime(player.getCurrentTime())
				seekTo(player.getCurrentTime())
				player.playVideo()
			}
		}
	}

	const seekTo = (seconds: number) => {
		if (player) {
			player.seekTo(seconds)
			setCurrentTime(seconds)
		}
	}

	const onStateChange = (state: YouTubeEvent<number>) => {
		setPlayerState(state.data)
		if (state.data === 0) {
			setCurrentTime(0)
		} else if (state.data === 1) {
			setIntervalID(
				setInterval(() => {
					setCurrentTime(player.getCurrentTime() || 0)
					setPlayerState(state.data)
				}, 100)
			)
		} else {
			clearInterval(intervalID)
		}
	}

	const opts: YouTubeProps['opts'] = {
		width: '100%',
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 0,
			controls: 0,
			enablejsapi: true,
			modestbranding: true,
			rel: 0,
		},
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-col gap-3 video-player-wrapper'>
				<YouTube
					videoId={videoId}
					opts={opts}
					onReady={onPlayerReady}
					onStateChange={onStateChange}
				/>
				<VideoProgressBar duration={duration} currentTime={currentTime} onSeek={seekTo} />
			</div>
			<div className='mt-20'>
				<Button onClick={playPause} theme={customButtonTheme}>
					{playerState === 1 ? <IoPauseSharp /> : <IoPlaySharp />}
				</Button>
				<Button onClick={() => console.log(player.getIframe())}>Get DOM</Button>
			</div>
		</div>
	)
}
