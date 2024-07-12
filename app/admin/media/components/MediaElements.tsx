import { PageableContent, Media } from '@/utils/types'
import React from 'react'
import MediaElement from './MediaElement'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setSelected } from '@/redux/reducers/mediaReducer'

function MediaElements({ media }: { media: PageableContent<Media> }) {
	const selected = useAppSelector(state => state.media.selected)
	const dispatch = useAppDispatch()

	const handleSelect = (media: Media) => {
		if (selected && selected.id === media.id) {
			dispatch(setSelected(null))
		} else {
			dispatch(setSelected(media))
		}
	}

	return (
		<>
			{media.content &&
				media.content.map(m => (
					<MediaElement key={m.id} m={m} handleSelect={() => handleSelect(m)} selected={selected} />
				))}
			{media && media.content && media.content.length === 0 && <div>Nessun media trovato</div>}
		</>
	)
}

export default MediaElements
