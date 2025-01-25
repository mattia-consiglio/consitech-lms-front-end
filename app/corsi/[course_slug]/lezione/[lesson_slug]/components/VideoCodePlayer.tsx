"use client"
import React, { useState } from "react"
import VideoPlayer from "./VideoPlayer"
import { PlayerState } from "./playerTypes"
import CodePlayer from "./CodePlayer"
import { MediaVideo } from "@/utils/types"

interface VideoCodePlayerProps {
	video: MediaVideo
	sourceCode: string
	displayCode: boolean
}

export default function VideoCodePlayer({
	video,
	sourceCode,
	displayCode,
}: Readonly<VideoCodePlayerProps>) {
	const [currentTime, setCurrentTime] = useState(0)
	const [playerState, setPlayerState] = useState(PlayerState.UNSTARTED)
	const [currentSpeed, setCurrentSpeed] = useState(1)

	return displayCode ? (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
			<VideoPlayer
				video={video}
				setCurrentTime={setCurrentTime}
				setPlayerState={setPlayerState}
				setCurrentSpeed={setCurrentSpeed}
				playerState={playerState}
				currentTime={currentTime}
				currentSpeed={currentSpeed}
			/>
			<CodePlayer
				sourceCode={sourceCode}
				currentTime={currentTime}
				playerState={playerState}
				currentSpeed={currentSpeed}
			/>
		</div>
	) : (
		<div>
			<VideoPlayer
				video={video}
				setCurrentTime={setCurrentTime}
				setPlayerState={setPlayerState}
				setCurrentSpeed={setCurrentSpeed}
				playerState={playerState}
				currentTime={currentTime}
				currentSpeed={currentSpeed}
			/>
		</div>
	)
}
