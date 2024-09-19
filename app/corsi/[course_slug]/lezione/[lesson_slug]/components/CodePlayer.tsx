"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CodeEditor, { type MonacoFile } from "./CodeEditor"
import type { SrtLine } from "@/utils/types"
import { useAppSelector } from "@/redux/store"
import * as Diff from "diff"
import type { editor } from "monaco-editor"
import { PlayerState } from "./VideoPlayer"
import type { Monaco } from "@monaco-editor/react"

interface CodePlayerProps {
	sourceCode: string
}
/**
 * Represents a line of text from a subtitle file (SRT) along with the file it belongs to.
 * @property {string} text - The text content of the subtitle line.
 * @property {string} file - The file that the subtitle line belongs to.
 */
interface SrtText {
	text: string
	file: string
}

/**
 * Represents the options for a change event in a Monaco editor.
 * @property {editor.IIdentifiedSingleEditOperation["range"]} range - The range of the edit operation.
 * @property {string} text - The new text to be inserted.
 * @property {string} targetText - The text that was replaced.
 */
interface MonacoEditorChangeOptions {
	range: editor.IIdentifiedSingleEditOperation["range"]
	text: string
	targetText: string
}

/**
 * Represents the changes made to a range of text in a document.
 * @property {number} rangeOffset - The offset of the changed range from the start of the document.
 * @property {number} rangeLength - The length of the changed range.
 * @property {string} rangeText - The new text that was inserted or replaced.
 * @property {string} originalText - The original text that was replaced.
 * @property {string} targetText - The text that the range was changed to.
 */
interface Changes2DRange {
	rangeOffset: number
	rangeLength: number
	rangeText: string
	originalText: string
	targetText: string
}
/**
 * The `CodePlayer` component is responsible for managing the code editor and synchronizing it with the video player.
 * It handles updating the files displayed in the code editor based on the current time in the video player, and provides
 * functionality to simulate file changes in the editor.
 *
 * The component uses the `CodeEditor` component to render the code editor, and manages the state of the files being
 * displayed. It also uses the `useAppSelector` hook to access the current state of the video player, including the
 * current time, player state, and current speed.
 *
 * The `updateFiles` function is used to update the files displayed in the code editor based on the provided source text.
 * It determines the language mode of the file based on its extension, and updates the file's content and metadata in the
 * `files` object. If the file has changed, it calculates the differences between the previous and current content, and
 * uses the `handleEditorChange` function to simulate the changes in the editor.
 *
 * The component also manages the timeouts used to update the files in sync with the video player's current time and
 * playback speed.
 */
function CodePlayer({ sourceCode }: Readonly<CodePlayerProps>) {
	const currentFilePathRef = useRef("")
	const [currentFile, setCurrentFile] = useState("")
	const timeoutArray = useRef([] as NodeJS.Timeout[])
	const sourceCodeArray = useMemo(
		() => JSON.parse(sourceCode) as SrtLine[],
		[sourceCode],
	)
	const { currentTime, playerState, currentSpeed } = useAppSelector(
		(state) => state.player,
	)
	const [filteredArray, setFilteredArray] = useState([] as SrtLine[])
	const files = useRef(
		{} as { [key: string]: { model: editor.ITextModel } & MonacoFile },
	)
	const [editorState, setEditorState] =
		useState<editor.IStandaloneCodeEditor | null>(null)
	const [monacoState, setMonacoState] = useState<Monaco | null>(null)
	const prevVideoSpeed = useRef(1)
	const currentTimeRef = useRef(currentTime)
	const [toggleTabChange, setToggleTabChange] = useState(false)

	/**
	 * Determines the language mode for a given file based on its file extension.
	 *
	 * @param file - The file name, including the file extension.
	 * @returns The language mode for the file, or 'auto' if the extension is not recognized.
	 */
	const getLanguage = useCallback((file: string) => {
		const extension = file.split(".").pop()
		switch (extension) {
			case "js":
				return "javascript"
			case "ts":
				return "typescript"
			case "html":
				return "html"
			case "css":
				return "css"
			default:
				return "auto"
		}
	}, [])

	//simulate file onChange event with monaco editor with only changes not entire file
	const handleEditorChange = useCallback(
		(
			{ range, text, targetText }: MonacoEditorChangeOptions,
			fileChanged = false,
		) => {
			if (!editorState || !monacoState || !range) return
			const file = files.current[currentFilePathRef.current]

			const model = file.model
			if (!model) return

			if (fileChanged) {
				editorState.executeEdits("", [
					{
						range: model.getFullModelRange(),
						text: file?.value,
					},
				])
			}

			//create edit operation
			const editOp: editor.IIdentifiedSingleEditOperation = {
				range: range,
				text: text,
				forceMoveMarkers: false,
			}
			monacoState.editor.setModelLanguage(model, file.language)

			//push changes to editor
			model.pushEditOperations([], [editOp], () => null)

			// ensure value is set
			if (model.getValue() !== targetText) {
				model.setValue(targetText)
			}
		},
		[editorState, monacoState],
	)

	/**
	 * Calculates the differences between two strings and returns a 2D range of changes.
	 *
	 * This function uses the `diff-match-patch` library to calculate the differences between the `originalText` and `text` strings. It returns an object containing the following properties:
	 *
	 * - `rangeOffset`: The starting offset of the changed range.
	 * - `rangeLength`: The length of the changed range.
	 * - `rangeText`: The text to be inserted at the changed range.
	 * - `originalText`: The original text.
	 * - `targetText`: The target text.
	 *
	 * If the `originalText` and `text` are the same, the function returns `null`.
	 *
	 * @param {string} text - The target text to compare against the original text.
	 * @param {string} originalText - The original text to compare against the target text.
	 * @returns {Changes2DRange | null} - An object containing the details of the changes, or `null` if there are no changes.
	 */
	const getTextDifference2DRanges = useCallback(
		(text: string, originalText: string): Changes2DRange | null => {
			let rangeOffset = 0 // Start of the range (changed text)
			let rangeLength = 0 // Length of the range (removed text)
			let rangeText = "" // Text to insert
			let changes = 0
			let deletions = 0
			let additions = 0

			if (originalText === text) return null
			const diff = Diff.diffChars(originalText, text)

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
				rangeOffset = changes ? rangeOffset : rangeOffset + rangeLength
			})

			const result = {
				rangeOffset,
				rangeLength,
				rangeText,
				originalText,
				targetText: text,
			}
			return result
		},
		[],
	)

	/**
	 * Converts a 2D range of changes into Monaco editor change operations.
	 *
	 * @param {Changes2DRange} changes - An object containing the details of the changes, including the range offset, range length, range text, original text, and target text.
	 * @returns {MonacoEditorChangeOptions} - An object containing the Monaco editor change options, including the range and the replacement text.
	 */
	const convert2DChangesToMonacoOperations = useCallback(
		({
			rangeOffset,
			rangeLength,
			rangeText,
			originalText,
			targetText: targeText,
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

			for (let i = 0; i < lines.length; i++) {
				const lineLength = lines[i].length + eolLength
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

			const monacoRange: editor.IIdentifiedSingleEditOperation["range"] = {
				startLineNumber,
				startColumn,
				endLineNumber,
				endColumn,
			}
			return { range: monacoRange, text: rangeText, targetText: targeText }
		},
		[],
	)

	/**
	 * Updates the files displayed in the code editor based on the provided source text.
	 *
	 * @param sourceText - The source text containing information about the file to be updated.
	 * @param init - A boolean flag indicating whether this is an initial update or not.
	 * @returns Void
	 */

	const updateFiles = useCallback(
		(sourceText: string, init = false) => {
			const { file, text } = JSON.parse(sourceText) as SrtText
			const language = getLanguage(file)
			const path = `codePlayer/${file}`
			if (init) {
				if (files.current[path]) return
				if (!monacoState) return
				const model = monacoState.editor.createModel(
					text,
					language,
					monacoState.Uri.parse(path),
				)
				files.current[path] = {
					model,
					name: file,
					language,
					value: text,
					isChanged: false,
				}
				if (currentFilePathRef.current === "") {
					currentFilePathRef.current = path
					setCurrentFile(path)
				}
				return
			}
			const model = editorState?.getModel()
			if (!model) return
			setToggleTabChange((prev) => !prev)
			const pervFileText = model ? model.getValue() : ""
			const fileChanged = currentFilePathRef.current !== path
			currentFilePathRef.current = path
			setCurrentFile(path)
			files.current[path] = {
				model,
				name: file,
				language,
				value: text,
				isChanged: true,
			}
			const diff = getTextDifference2DRanges(text, pervFileText)
			if (!diff) return
			const monacoOperation = convert2DChangesToMonacoOperations(diff)
			handleEditorChange(monacoOperation, fileChanged)
		},
		[
			convert2DChangesToMonacoOperations,
			editorState,
			getLanguage,
			getTextDifference2DRanges,
			handleEditorChange,
			monacoState,
		],
	)

	useEffect(() => {
		if (!editorState) return
		for (const element of sourceCodeArray) {
			updateFiles(element.text, true)
		}
	}, [sourceCodeArray, updateFiles, editorState])

	useEffect(() => {
		if (playerState !== 1) {
			const time = currentTime * 1000
			const newFilteredArray = sourceCodeArray.filter((element) => {
				return element.timeStart >= time
			})
			newFilteredArray.unshift(
				sourceCodeArray.find(
					(element) => element.timeStart <= time && element.timeEnd > time,
				) as SrtLine,
			)

			setFilteredArray(newFilteredArray)
		}
	}, [currentTime, playerState, sourceCodeArray])

	useEffect(() => {
		currentTimeRef.current = currentTime
	}, [currentTime])

	useEffect(() => {
		if (
			playerState !== PlayerState.PLAYING ||
			prevVideoSpeed.current !== currentSpeed
		) {
			for (const timeout of timeoutArray.current) {
				clearTimeout(timeout)
			}
		}

		const time = currentTimeRef.current * 1000
		if (filteredArray.length === 0) return

		for (const [index, element] of filteredArray.entries()) {
			if (element === undefined) continue
			if (index === 0) {
				updateFiles(element.text)
			}
			if (playerState === PlayerState.PLAYING) {
				timeoutArray.current.push(
					setTimeout(
						() => {
							updateFiles(element.text)
						},
						element.timeStart / currentSpeed - time,
					),
				)
			}
		}
	}, [filteredArray, playerState, currentSpeed, updateFiles])

	useEffect(() => {
		prevVideoSpeed.current = currentSpeed
	}, [currentSpeed])

	return (
		<CodeEditor
			key="code-player"
			currenFile={currentFile}
			files={files.current}
			externalEditor={editorState}
			externalSetEditor={setEditorState}
			externalMonaco={monacoState}
			externalSetMonaco={setMonacoState}
			toggleTabChange={toggleTabChange}
		/>
	)
}

export default CodePlayer
