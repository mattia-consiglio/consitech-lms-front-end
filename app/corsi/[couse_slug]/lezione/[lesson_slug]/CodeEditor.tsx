'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { loader, Editor } from '@monaco-editor/react'

interface CodeEditorProps {
	code?: string
}

export default function CodeEditor({ code }: CodeEditorProps) {
	return (
		<div className='min-h-[300px] h-[300px] w-full'>
			<Editor
				height='100%'
				width='100%'
				defaultLanguage='html'
				defaultValue='<html></html>'
				theme='vs-dark'
			/>
		</div>
	)
}
