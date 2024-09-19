"use client"
import type React from "react"
import { type ReactElement, useEffect, useState } from "react"
import { Editor, type Monaco } from "@monaco-editor/react"
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es"
import type { editor } from "monaco-editor"
import { SiCss3, SiHtml5, SiJavascript, SiTypescript } from "react-icons/si"
import { useAppDispatch } from "@/redux/store"
import { setPlayerIsInFocus } from "@/redux/reducers/playerReducer"

export interface MonacoFile {
	name: string
	language: string
	value: string
	isChanged?: boolean
}
export type CodeEditorFilesMap = {
	[key: string]: { model: editor.ITextModel } & MonacoFile
}

interface CodeEditorProps {
	currenFile: string
	files: CodeEditorFilesMap
	externalEditor?: editor.IStandaloneCodeEditor | null
	externalSetEditor?: React.Dispatch<
		React.SetStateAction<editor.IStandaloneCodeEditor | null>
	>
	externalMonaco?: Monaco | null
	externalSetMonaco?: React.Dispatch<React.SetStateAction<Monaco | null>>
	toggleTabChange?: boolean
}

const fileIcons: { [key: string]: ReactElement } = {
	html: <SiHtml5 />,
	css: <SiCss3 />,
	js: <SiJavascript />,
	ts: <SiTypescript />,
}

export default function CodeEditor({
	files,
	currenFile,
	externalEditor,
	externalSetEditor,
	externalMonaco,
	externalSetMonaco,
	toggleTabChange,
}: Readonly<CodeEditorProps>) {
	const [fileName, setFileName] = useState(currenFile)
	const [localEditorState, setLocalEditorState] =
		useState<editor.IStandaloneCodeEditor | null>(null)
	const editorState =
		externalEditor !== undefined ? externalEditor : localEditorState
	const setEditorState = externalSetEditor ?? setLocalEditorState
	const [localMonacoState, setLocalMonacoState] = useState<Monaco | null>(null)
	const monacoState = externalMonaco ?? localMonacoState
	const setMonacoState = externalSetMonaco ?? setLocalMonacoState

	console.log("files in CodeEditor", files)
	const dispatch = useAppDispatch()

	// biome-ignore lint/correctness/useExhaustiveDependencies: Needed for updating the tab on video play
	useEffect(() => {
		setFileName(currenFile)
	}, [currenFile, toggleTabChange])

	/**
	 * Handles the change of the selected file in the code editor's tab bar.
	 * Sets the new value of the selected file in the editor and updates the
	 * externalSelectedFile ref if it is defined.
	 * @param {string} tabFile - The name of the newly selected file
	 */
	const handleTabChange = (tabFile: string) => {
		setFileName(tabFile)
		if (!files) return
		const file = files[tabFile]
		if (editorState && monacoState) {
			const model = file.model
			editorState.setModel(model)
			monacoState.editor.setModelLanguage(model, file.language)
			model.setValue(file.value)
		}
	}

	//add emmet support
	/**
	 * Handles the initialization and setup of the code editor when it is mounted.
	 * This function sets up the Emmet support for HTML, CSS, and JSX, assigns the
	 * editor and Monaco instances to the component's refs, and sets the language
	 * mode of the editor based on the current file's language.
	 *
	 * @param {editor.IStandaloneCodeEditor} editor - The code editor instance.
	 * @param {Monaco} monaco - The Monaco editor instance.
	 */
	const handleEditorDidMount = (
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) => {
		emmetHTML(monaco)
		emmetCSS(monaco)
		emmetJSX(monaco)
		setEditorState(editor)
		setMonacoState(monaco)
		const file = files[fileName]
		if (file) {
			editor.setModel(file.model)
		}
	}

	function removeVideoFocus() {
		dispatch(setPlayerIsInFocus(false))
	}

	return (
		<div
			className="w-full"
			onClick={removeVideoFocus}
			onKeyDown={removeVideoFocus}
			onFocus={removeVideoFocus}
		>
			<div className="min-h-[300px] h-[300px] w-full">
				{files && (
					<div>
						{Object.entries(files).map((tabFile) => (
							<button
								type="button"
								key={tabFile[0]}
								onClick={() => handleTabChange(tabFile[0])}
								className={`inline-flex gap-1 items-center p-2 border-t-3 mr-[0.15rem] hover:bg-[#2e2e2e] text-neutral-200 text-left ${
									fileName === tabFile[0]
										? "bg-[#1e1e1e] border-t-[#3399cc]"
										: "bg-[#34352f] border-t-[#34352f]"
								} `}
							>
								{fileIcons[files[tabFile[0]].language]}
								{tabFile[1].name}
							</button>
						))}
					</div>
				)}
				<Editor
					height="100%"
					width="100%"
					// path={currenFile}
					theme="vs-dark"
					onMount={handleEditorDidMount}
				/>
			</div>
		</div>
	)
}
