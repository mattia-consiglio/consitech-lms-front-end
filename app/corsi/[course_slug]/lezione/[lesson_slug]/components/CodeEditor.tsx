"use client"
import type React from "react"
import { type ReactElement, useEffect, useRef, useState } from "react"
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
export interface CodeEditorFilesMap {
	[key: string]: MonacoFile
}

interface CodeEditorProps {
	currenFile: string
	files: CodeEditorFilesMap
	externalEditorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor>
	externalMonacoRef?: React.MutableRefObject<Monaco>
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
	externalEditorRef,
	externalMonacoRef,
}: Readonly<CodeEditorProps>) {
	const [fileName, setFileName] = useState(currenFile)
	const prevFileName = useRef(currenFile)
	const localEditorRef = useRef(null as unknown as editor.IStandaloneCodeEditor)
	const editorRef = externalEditorRef ?? localEditorRef
	const localMonacoRef = useRef(null as unknown as Monaco)
	const monacoRef = externalMonacoRef ?? localMonacoRef

	const file = files ? files[fileName] : null
	const dispatch = useAppDispatch()
	// const prevChanges = useRef(changes)

	// const file = fileName ? localFiles[fileName] : null

	useEffect(() => {
		console.log("currenFile in useEffect", currenFile)
		setFileName(currenFile)
	}, [currenFile])

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
		editorRef.current?.setValue(file?.value)
		const model = editorRef.current.getModel()
		if (model && file?.language) {
			monacoRef.current.editor.setModelLanguage(model, file.language)
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
		editorRef.current = editor
		monacoRef.current = monaco
		const model = editor.getModel()
		if (model && file?.language) {
			monaco.editor.setModelLanguage(model, file.language)
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
					// language={file?.language ? file.language : "auto"}
					path={currenFile}
					theme="vs-dark"
					// value={file?.value}
					// onChange={(value, event) => {
					// 	console.log(event.changes[0].range)
					// }}
					onMount={handleEditorDidMount}
				/>
			</div>
		</div>
	)
}
