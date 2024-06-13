'use client'
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeEditor, { CodeEditorFilesMap, MonacoFile } from './CodeEditor'
import { SrtLine } from '@/utils/types'
import { useAppSelector } from '@/redux/store'
import { text } from 'stream/consumers'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import * as Diff from 'diff'

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
	const prevText = useRef('')

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
			const path = 'codePlayer/' + file
			if (init) {
				if (files.current[path]) return
				files.current[path] = { name: file, language, value: '' }
				return
			}
			files.current[path] = { name: file, language, value: text }
			setCurrentCode(path)
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
		if (playerState !== 1) {
			timeoutArray.current.forEach(timeout => clearTimeout(timeout))
		}
		const time = currentTime * 1000
		if (filteredArray.length === 0) return
		filteredArray.forEach((element, index) => {
			if (element === undefined) return
			if (index === 0) {
				updateFiles(element.text)
			}
			if (playerState === 1) {
				timeoutArray.current.push(
					setTimeout(() => {
						updateFiles(element.text)
					}, element.timeStart - time)
				)
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredArray, playerState])

	interface Changes2DRange {
		rangeOffset: number
		rangeLength: number
		rangeText: string
		originalText: string
	}

	const getTextDifference2DRanges = (text: string): Changes2DRange => {
		let rangeOffset = 0 // Start of the range (changed text)
		let rangeLength = 0 // Length of the range (removed text)
		let rangeText = '' // Text to insert

		// const JsDiff = require('diff')
		const originalText = prevText.current
		const diff = Diff.diffChars(prevText.current, text)
		prevText.current = text
		console.log(diff)

		let changes = 0
		let deletions = 0
		let additions = 0
		diff.forEach((part, i) => {
			const isLast = i === diff.length - 1
			if (part.added) {
				rangeText = rangeText + part.value
				changes++
				additions++
			} else if (part.removed) {
				rangeLength += part.value.length // Length of the removed text
				changes++
				deletions++
			} else {
				if (!changes) {
					rangeOffset += part.value.length ? part.value.length : 0
				}

				if (changes && !isLast) {
					rangeLength += part.value.length
				}

				if (additions && !isLast) {
					rangeText = rangeText + part.value
				}

				if (deletions && !additions && !isLast) {
					rangeLength -= part.value.length
				}
			}
			rangeOffset = changes ? rangeOffset : (rangeOffset += rangeLength)
		})

		const result = { rangeOffset, rangeLength, rangeText, originalText }
		console.log(result)
		return result
	}

	const convert2DChangesToMonacoOperations = ({
		rangeOffset,
		rangeLength,
		rangeText,
		originalText,
	}: Changes2DRange) => {
		let start = rangeOffset
		let end = rangeOffset + rangeLength
		let startLineNumber = 0
		let startColumn = 0
		let endLineNumber = 0
		let endColumn = 0
		const eol = /\r\n|\n/
		const lines = originalText.split(eol)
		const eolLength = originalText.replace(originalText, '')[0] === '\r' ? 2 : 1

		lines.forEach((line, i) => {
			const lineLength = line.length + eolLength
			if (end === 0) return
			if (start >= lineLength) {
				start -= lineLength
				startLineNumber++
			} else if (start) {
				startColumn = start + 1
				startLineNumber++
				start = 0
			}
			if (end >= lineLength) {
				end -= lineLength
				endLineNumber++
			} else if (end) {
				endColumn = end + 1
				endLineNumber++
				end = 0
			}
		})
		const monacoRange = {
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
		}
		console.log('monacoRange', monacoRange)
		return { range: monacoRange, text: rangeText }
	}

	return (
		<>
			<textarea
				name=''
				id=''
				className={adminStyles.input}
				onChange={e => {
					const diff = getTextDifference2DRanges(e.target.value)
					console.log(diff)
					convert2DChangesToMonacoOperations(diff)
				}}
			></textarea>
			<CodeEditor key='code-player' currenFile={currentCode} files={files.current} />
		</>
	)
}

export default CodePlayer
