'use client'
import React from 'react'
import CodeEditor from './CodeEditor'

const CodeSandbox = () => {
	return (
		<>
			<CodeEditor
				key='code-editor'
				files={{ 'sandbox/index.html': { name: 'index.html', language: 'html', value: '' } }}
				currenFile='sandbox/index.html'
			/>
		</>
	)
}

export default CodeSandbox
