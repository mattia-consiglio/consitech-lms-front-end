'use client'
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeEditor, { CodeEditorFilesMap } from './CodeEditor'
import { SrtLine } from '@/utils/types'
import { useAppSelector } from '@/redux/store'
import { text } from 'stream/consumers'
import adminStyles from '@/app/admin/styles/admin.module.scss'
import * as Diff from 'diff'
import { editor } from 'monaco-editor'
import { PlayerState } from './VideoPlayer'

interface CodePlayerProps {
	sourceCode: string
}
interface SrtText {
	text: string
	file: string
}
interface MonacoEditorChangeOptions {
	range: editor.IIdentifiedSingleEditOperation['range']
	text: string
	targetText: string
}

function CodePlayer({ sourceCode }: CodePlayerProps) {
	const currentPathRef = useRef('')
	const timeoutArray = useRef([] as NodeJS.Timeout[])
	const sourceCodeArray = useMemo(() => JSON.parse(sourceCode) as SrtLine[], [sourceCode])
	const { currentTime, playerState, currentSpeed } = useAppSelector(state => state.player)
	const [filteredArray, setFilteredArray] = useState([] as SrtLine[])
	const files = useRef({} as CodeEditorFilesMap)
	const changes = useRef({} as MonacoEditorChangeOptions)
	const editorRef = useRef(null as unknown as editor.IStandaloneCodeEditor)
	const editorCurrentPath = useRef('')
	const isEditorChanged = useRef(false)
	const prevVideoSpeed = useRef(1)

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

	//simulate file onChange event with monaco editor with only changes not entire file
	const handleEditorChange = useCallback(
		({ range, text, targetText }: MonacoEditorChangeOptions) => {
			// console.log('handleEditorChange', range, text)
			if (!editorRef.current) return
			if (!range) return
			const model = editorRef.current.getModel()
			if (!model) return
			// console.log(value)

			//create edit operation
			const editOp: editor.IIdentifiedSingleEditOperation = {
				range: range,
				text: text,
				forceMoveMarkers: false,
			}
			// console.log('editOp', editOp)

			//push changes to editor
			editorRef.current.pushUndoStop()
			model.pushEditOperations([], [editOp], () => null)
			if (editorRef.current.getValue() !== targetText) {
				editorRef.current.setValue(targetText)
			}
		},
		[]
	)

	const getTextDifference2DRanges = useCallback(
		(text: string, originalText: string): Changes2DRange | null => {
			let rangeOffset = 0 // Start of the range (changed text)
			let rangeLength = 0 // Length of the range (removed text)
			let rangeText = '' // Text to insert
			let changes = 0
			let deletions = 0
			let additions = 0

			if (originalText === text) return null
			// const JsDiff = require('diff')
			// const originalText = prevText.current
			const diff = Diff.diffChars(originalText, text)
			// prevText.current = text
			// console.log(diff)

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

			const result = { rangeOffset, rangeLength, rangeText, originalText, targeText: text }
			// console.log(result)
			return result
		},
		[]
	)

	const convert2DChangesToMonacoOperations = useCallback(
		({
			rangeOffset,
			rangeLength,
			rangeText,
			originalText,
			targeText,
		}: Changes2DRange): MonacoEditorChangeOptions => {
			let start = rangeOffset
			let end = rangeOffset + rangeLength
			let startLineNumber = 0
			let startColumn = 0
			let endLineNumber = 0
			let endColumn = 0
			const eol = /\r\n|\n/
			const lines = originalText.split(eol)
			//check if eol is /r/n or /n
			const eolLength = originalText.match(eol)?.[0]?.length || 1

			// const eolLength = originalText.replace(originalText, '')[0] === '\r' ? 2 : 1

			for (let i = 0; i < lines.length; i++) {
				const lineLength = lines[i].length + eolLength
				// if (end === 0) break
				if (start >= lineLength) {
					start -= lineLength
					startLineNumber++
				} else if (start || (start === 0 && i === 0)) {
					startColumn = start + 1
					startLineNumber++
					start = 0
				}

				if (end >= lineLength) {
					end -= lineLength
					endLineNumber++
				} else if (end || (end === 0 && i === 0)) {
					endColumn = end + 1
					endLineNumber++
					end = 0
					break
				}
			}

			const monacoRange: editor.IIdentifiedSingleEditOperation['range'] = {
				startLineNumber,
				startColumn,
				endLineNumber,
				endColumn,
			}
			// console.log('monacoRange', monacoRange)
			return { range: monacoRange, text: rangeText, targetText: targeText }
		},
		[]
	)

	const updateFiles = useCallback(
		(sourceText: string, init: boolean = false) => {
			const { file, text } = JSON.parse(sourceText) as SrtText
			const language = getLanguage(file)
			const path = 'codePlayer/' + file
			if (init) {
				if (files.current[path]) return
				files.current[path] = { name: file, language, value: '', isChanged: false }
				if (currentPathRef.current === '') currentPathRef.current = path
				return
			}
			// console.log('editorCurrentPath.current', editorCurrentPath.current)
			if (editorCurrentPath.current !== currentPathRef.current) return
			const pervFileText = editorRef.current ? editorRef.current.getValue() : ''
			currentPathRef.current = path
			files.current[path] = { name: file, language, value: text, isChanged: true }
			const diff = getTextDifference2DRanges(text, pervFileText)
			if (!diff) return
			const monacoOperation = convert2DChangesToMonacoOperations(diff)
			handleEditorChange(monacoOperation)
		},
		[convert2DChangesToMonacoOperations, getTextDifference2DRanges, handleEditorChange]
	)

	useEffect(() => {
		sourceCodeArray.forEach(element => {
			updateFiles(element.text, true)
		})
		// console.log('files', files)
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
		if (playerState !== PlayerState.PLAYING || prevVideoSpeed.current !== currentSpeed) {
			timeoutArray.current.forEach(timeout => clearTimeout(timeout))
		}
		const time = currentTime * 1000
		if (filteredArray.length === 0) return
		filteredArray.forEach((element, index) => {
			if (element === undefined) return
			if (index === 0) {
				updateFiles(element.text)
			}
			if (playerState === PlayerState.PLAYING) {
				timeoutArray.current.push(
					setTimeout(() => {
						updateFiles(element.text)
					}, element.timeStart / currentSpeed - time)
				)
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredArray, playerState, currentSpeed])

	useEffect(() => {
		prevVideoSpeed.current = currentSpeed
	}, [currentSpeed])
	interface Changes2DRange {
		rangeOffset: number
		rangeLength: number
		rangeText: string
		originalText: string
		targeText: string
	}

	return (
		<>
			<CodeEditor
				key='code-player'
				currenFile={currentPathRef.current}
				files={files.current}
				externalEditorRef={editorRef}
				externalSelectedFile={editorCurrentPath}
			/>
		</>
	)
}

export default CodePlayer
