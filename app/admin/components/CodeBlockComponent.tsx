import style from '@/app/styles/mixins.module.scss'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import exp from 'constants'
import React from 'react'

const CodeBlockComponent = ({
	node: {
		attrs: { language: defaultLanguage = 'null' },
	},
	updateAttributes,
	extension,
}: {
	node: { attrs: { language: string } }
	updateAttributes: (attrs: { language: string }) => void
	extension: any
}) => (
	<NodeViewWrapper className='relative'>
		<select
			contentEditable={false}
			defaultValue={defaultLanguage}
			onChange={event => updateAttributes({ language: event.target.value })}
			className={'absolute right-2 top-2' + style.inputMixin}
		>
			<option value='null'>auto</option>
			<option disabled>—</option>
			{extension.options.lowlight
				.listLanguages()
				.filter(Boolean)
				.map((lang: string) => (
					<option key={lang} value={lang}>
						{lang}
					</option>
				))}
		</select>
		<pre>
			<NodeViewContent as='code' />
		</pre>
	</NodeViewWrapper>
)

export default CodeBlockComponent
