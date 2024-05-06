'use client'
import { Editor } from '@monaco-editor/react'
import React from 'react'

export default function CodeEditor() {
	return (
		<div>
			<Editor
				height='300px'
				width='100%'
				defaultLanguage='html'
				defaultValue='<html></html>'
				theme='vs-dark'
			/>
		</div>
	)
}
