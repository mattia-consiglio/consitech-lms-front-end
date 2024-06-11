'use client'
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeEditor, { CodeEditorFilesMap, MonacoFile } from './CodeEditor'
import { SrtLine } from '@/utils/types'
import { useAppSelector } from '@/redux/store'

interface CodePlayerProps {
	sourceCode: string
}
interface SrtText {
	text: string
	file: string
}

function CodePlayer({ sourceCode }: CodePlayerProps) {
	const [currentCode, setCurrentCode] = useState('')
	const timeoutArray = useRef([] as NodeJS.Timeout[])
	const sourceCodeArray = useMemo(() => JSON.parse(sourceCode) as SrtLine[], [sourceCode])
	const { currentTime, playerState } = useAppSelector(state => state.player)
	const [filteredArray, setFilteredArray] = useState([] as SrtLine[])
	const files = useRef({} as CodeEditorFilesMap)
	console.log('files', files)

	const getLanguage = (file: string) => {
		const extension = file.split('.').pop()
		switch (extension) {
			case 'js':
				return 'javascript'
			case 'ts':
				return 'typescript'
			case 'html':
				return 'html'
			case 'css':
				return 'css'
			default:
				return 'auto'
		}
	}

	const updateFiles = useCallback(
		(sourceText: string, init: boolean = false) => {
			const { file, text } = JSON.parse(sourceText) as SrtText
			const language = getLanguage(file)
			if (init) {
				if (files.current[file]) return
				files.current[file] = { name: file, language, value: '' }
				return
			}
			files.current[file] = { name: file, language, value: text }
			setCurrentCode(file)
		},
		[files]
	)

	useEffect(() => {
		sourceCodeArray.forEach(element => {
			updateFiles(element.text, true)
		})
		console.log('files', files)
	}, [sourceCodeArray, updateFiles])

	useEffect(() => {
		if (playerState !== 1) {
			const time = currentTime * 1000
			const newFilteredArray = sourceCodeArray.filter(element => {
				return element.timeStart >= time
			})
			newFilteredArray.unshift(
				sourceCodeArray.find(
					element => element.timeStart <= time && element.timeEnd > time
				) as SrtLine
			)

			setFilteredArray(newFilteredArray)
		}
	}, [currentTime, playerState, sourceCodeArray])

	useEffect(() => {
		// console.log('playerState', playerState)
		if (playerState !== 1) {
			timeoutArray.current.forEach(timeout => clearTimeout(timeout))
		}
		// console.log('filteredArray', filteredArray, filteredArray.length)
		const time = currentTime * 1000
		if (filteredArray.length === 0) return
		filteredArray.forEach((element, index) => {
			if (element === undefined) return
			const { text, file } = JSON.parse(element.text) as SrtText
			if (index === 0) {
				updateFiles(element.text)
			}
			if (playerState === 1) {
				timeoutArray.current.push(
					setTimeout(() => {
						updateFiles(element.text)
						// console.log('file')
					}, element.timeStart - time)
				)
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredArray, playerState])

	return (
		<>
			<CodeEditor currenFile={currentCode} files={files.current} />
		</>
	)
}

export default CodePlayer
