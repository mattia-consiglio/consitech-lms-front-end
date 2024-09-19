"use client"
import React, { useEffect, useState } from "react"
import CodeEditor, { type MonacoFile } from "./CodeEditor"
import type { Monaco } from "@monaco-editor/react"
import type { editor } from "monaco-editor"

const CodeSandbox = () => {
	const [monacoState, setMonacoState] = useState<Monaco | null>(null)

	const [files, setFiles] = useState(
		{} as { [key: string]: { model: editor.ITextModel } & MonacoFile },
	)

	useEffect(() => {
		if (!monacoState) {
			return
		}
		const model = monacoState.editor.createModel(
			"",
			"html",
			monacoState.Uri.parse("sandbox/index.html"),
		)
		setFiles({
			"sandbox/index.html": {
				model,
				name: "index.html",
				language: "html",
				value: "",
			},
		})
	}, [monacoState])

	return (
		<CodeEditor
			key="code-editor"
			files={files}
			currenFile="sandbox/index.html"
			externalMonaco={monacoState}
			externalSetMonaco={setMonacoState}
		/>
	)
}

export default CodeSandbox
