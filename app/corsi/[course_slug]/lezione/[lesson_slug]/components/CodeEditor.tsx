'use client'
import React, { ReactElement, use, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { loader, Editor, Monaco } from '@monaco-editor/react'
import { emmetCSS, emmetHTML, emmetJSX } from 'emmet-monaco-es'
import { editor } from 'monaco-editor'
import { SiCss3, SiHtml5, SiJavascript, SiTypescript } from 'react-icons/si'
import { IconType } from '@react-icons/all-files'

export interface MonacoFile {
	name: string
	language: string
	value: string
}
export interface CodeEditorFilesMap {
	[key: string]: MonacoFile
}

interface CodeEditorProps {
	currenFile: string
	files: CodeEditorFilesMap
}

const fileIcons: { [key: string]: ReactElement } = {
	'html': <SiHtml5 />,
	'css': <SiCss3 />,
	'js': <SiJavascript />,
	'ts': <SiTypescript />,
}

export default function CodeEditor({ files, currenFile }: CodeEditorProps) {
	const [fileName, setFileName] = useState(currenFile)

	const file = files ? files[fileName] : null

	// const file = fileName ? localFiles[fileName] : null

	useEffect(() => {
		setFileName(currenFile)
	}, [currenFile])

	//add emmet support
	const handleEditorDidMount = (_editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
		emmetHTML(monaco)
		emmetCSS(monaco)
		emmetJSX(monaco)
	}

	return (
		<div className='min-h-[300px] h-[300px] w-full'>
			{files && (
				<div>
					{Object.keys(files).map((tabFile, index) => (
						<button
							key={index}
							onClick={() => setFileName(tabFile)}
							className={`inline-flex gap-1 items-center p-2 border-t-3 mr-[0.15rem] hover:bg-[#2e2e2e] text-neutral-200 text-left ${
								fileName === tabFile
									? 'bg-[#1e1e1e] border-t-[#3399cc]'
									: 'bg-[#34352f] border-t-[#34352f]'
							} `}
						>
							{fileIcons[files[tabFile].language]}
							{tabFile}
						</button>
					))}
				</div>
			)}
			<Editor
				height='100%'
				width='100%'
				language={file?.language ? file.language : 'auto'}
				path={fileName}
				theme='vs-dark'
				value={file?.value}
				onChange={(value, event) => {
					console.log(value)
				}}
				onMount={handleEditorDidMount}
			/>
		</div>
	)
}
