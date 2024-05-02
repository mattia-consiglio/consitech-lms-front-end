'use client'

import { setSubheaderTitle } from '@/redux/reducers/pageReducer'
import { useAppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'
import MainWrapper from '../components/MainWrapper'

export default function CoursesPage() {
	return (
		<MainWrapper subheaderTitle='Corsi'>
			<h1>Corsi</h1>
		</MainWrapper>
	)
}
