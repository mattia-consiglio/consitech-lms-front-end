'use client'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import {
	Editor,
	EditorContent,
	EditorProvider,
	ReactNodeViewRenderer,
	useCurrentEditor,
	useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useCallback, useEffect } from 'react'
import '@/app/styles/tiptapEditor.scss'
import {
	RiAlignCenter,
	RiAlignJustify,
	RiAlignLeft,
	RiAlignRight,
	RiArrowGoBackLine,
	RiArrowGoForwardLine,
	RiBold,
	RiCodeBlock,
	RiCodeLine,
	RiCornerDownRightLine,
	RiDoubleQuotesL,
	RiFormatClear,
	RiH1,
	RiH2,
	RiH3,
	RiH4,
	RiH5,
	RiH6,
	RiImageAddFill,
	RiItalic,
	RiLink,
	RiLinkUnlinkM,
	RiListOrdered2,
	RiListUnordered,
	RiParagraph,
	RiSeparator,
	RiStrikethrough,
	RiUnderline,
} from 'react-icons/ri'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import 'highlight.js/scss/atom-one-dark.scss'
// load all highlight.js languages
import { common, createLowlight } from 'lowlight'
import CodeBlockComponent from './CodeBlockComponent'
import adminStyles from '@/app/admin/styles/admin.module.scss'

const lowlight = createLowlight(common)

interface Funcs {
	editor: Editor
	addImage: () => void
	setLink: () => void
}

const MenuBar = ({ editor, addImage, setLink }: Funcs) => {
	return (
		<div className='tiptap-menu_bar'>
			<button
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
				type='button'
				aria-label='Annulla'
				title='Annulla'
			>
				<RiArrowGoBackLine />
			</button>
			<button
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
				type='button'
				aria-label='Ripeti'
				title='Ripeti'
			>
				<RiArrowGoForwardLine />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'is-active' : ''}
				type='button'
				aria-label='grassetto'
				title='grassetto'
			>
				<RiBold />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'is-active' : ''}
				type='button'
				aria-label='corsivo'
				title='corsivo'
			>
				<RiItalic />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				disabled={!editor.can().chain().focus().toggleUnderline().run()}
				className={editor.isActive('italic') ? 'is-active' : ''}
				type='button'
				aria-label='Sottolineato'
				title='Sottolineato'
			>
				<RiUnderline />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				className={editor.isActive('strike') ? 'is-active' : ''}
				type='button'
				aria-label='barrato'
				title='barrato'
			>
				<RiStrikethrough />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'is-active' : ''}
				type='button'
				aria-label='codice inline'
				title='codice inline'
			>
				<RiCodeLine />
			</button>
			<button
				onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
				type='button'
				aria-label='rimuovi formattazione'
				title='rimuovi formattazione'
			>
				<RiFormatClear />
			</button>
			<button
				onClick={() => editor.chain().focus().setParagraph().run()}
				className={editor.isActive('paragraph') ? 'is-active' : ''}
				type='button'
				aria-label='paragrafo'
				title='paragrafo'
			>
				<RiParagraph />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 1'
				title='intestazione 1'
			>
				<RiH1 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 2'
				title='intestazione 2'
			>
				<RiH2 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 3'
				title='intestazione 3'
			>
				<RiH3 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 4'
				title='intestazione 4'
			>
				<RiH4 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 5'
				title='intestazione 5'
			>
				<RiH5 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
				type='button'
				aria-label='intestazione 6'
				title='intestazione 6'
			>
				<RiH6 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'is-active' : ''}
				type='button'
				aria-label='elenco non ordinato'
				title='elenco non ordinato'
			>
				<RiListUnordered />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'is-active' : ''}
				type='button'
				aria-label='elenco ordinato'
				title='elenco ordinato'
			>
				<RiListOrdered2 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? 'is-active' : ''}
				type='button'
				aria-label='blocco codice'
				title='blocco codice'
			>
				<RiCodeBlock />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive('blockquote') ? 'is-active' : ''}
				type='button'
				aria-label='citazione'
				title='citazione'
			>
				<RiDoubleQuotesL />
			</button>
			<button
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				type='button'
				aria-label='riga orizzontale'
				title='riga orizzontale'
			>
				<RiSeparator />
			</button>
			<button
				onClick={() => editor.chain().focus().setHardBreak().run()}
				type='button'
				aria-label='a capo forzato'
				title='a capo forzato'
			>
				<RiCornerDownRightLine />
			</button>

			<button
				onClick={() => setLink()}
				className={editor.isActive('link') ? 'is-active' : ''}
				type='button'
				aria-label='Aggiungi link'
				title='Aggiungi link'
			>
				<RiLink />
			</button>
			<button
				onClick={() => editor.chain().focus().unsetLink().run()}
				disabled={!editor.isActive('link')}
				type='button'
				aria-label='Rimuovi link'
				title='Rimuovi link'
			>
				<RiLinkUnlinkM />
			</button>
			<button
				onClick={addImage}
				type='button'
				aria-label='Aggiungi immagine'
				title='Aggiungi immagine'
			>
				<RiImageAddFill />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('left').run()}
				className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
				type='button'
				aria-label='Allineamento a sinistra'
				title='Allineamento a sinistra'
			>
				<RiAlignLeft />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('center').run()}
				className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
				type='button'
				aria-label='Allineamento al centro'
				title='Allineamento al centro'
			>
				<RiAlignCenter />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('right').run()}
				className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
				type='button'
				aria-label='Allineamento a destra'
				title='Allineamento a destra'
			>
				<RiAlignRight />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('justify').run()}
				className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
				type='button'
				aria-label='Allineamento giustificato'
				title='Allineamento giustificato'
			>
				<RiAlignJustify />
			</button>
		</div>
	)
}

const extensions = [
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	TextStyle,
	Underline,
	CodeBlockLowlight.extend({
		addNodeView() {
			return ReactNodeViewRenderer(CodeBlockComponent)
		},
	}).configure({
		lowlight,
		defaultLanguage: 'plaintext',
	}),
	Link.configure({
		openOnClick: false,
		autolink: true,
	}),
	Image,
	TextAlign.configure({
		types: ['heading', 'paragraph', 'image', 'img'],
	}),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` because marks are not preserved when I try to preserve attrs, awaiting a bit of help
			HTMLAttributes: {
				class: 'list-disc list-inside pl-2',
			},
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` because marks are not preserved when I try to preserve attrs, awaiting a bit of help
			HTMLAttributes: {
				class: 'list-decimal list-inside pl-2',
			},
		},
		codeBlock: false,
	}),
]

interface Props {
	content: string
	onUpdate: (content: string) => void
}

const Tiptap = ({ content, onUpdate: setContent }: Props) => {
	const editor = useEditor({
		extensions: extensions,
		content: content,
		onUpdate({ editor }) {
			setContent(editor.getHTML())
		},
	})

	const addImage = useCallback(() => {
		const url = window.prompt('URL')

		if (url) {
			editor?.chain().focus().setImage({ src: url }).run()
		}
	}, [editor])

	const setLink = useCallback(() => {
		const previousUrl = editor?.getAttributes('link').href
		const url = window.prompt('URL', previousUrl)

		// cancelled
		if (url === null) {
			return
		}

		// empty
		if (url === '') {
			editor?.chain().focus().extendMarkRange('link').unsetLink().run()

			return
		}

		// update link
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
	}, [editor])

	const funcs: Funcs = {
		editor: editor as Editor,
		addImage,
		setLink,
	}

	if (!editor) {
		return null
	}

	return (
		<div className={adminStyles.input}>
			<MenuBar {...funcs} />
			<EditorContent editor={editor} />
		</div>
	)
}
export default Tiptap
