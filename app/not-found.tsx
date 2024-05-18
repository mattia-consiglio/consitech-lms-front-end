import React from 'react'

import Link from 'next/link'
import MainWrapper from './components/MainWrapper'
import styles from './login-register/login.module.scss'
import { Button } from 'flowbite-react'
import { customButtonTheme } from './flowbite.themes'

export default function NotFound() {
	return (
		<MainWrapper className={styles.main}>
			<div className='text-center flex flex-col items-center justify-center gap-y-3'>
				<h1>404</h1>
				<p>Non è stato trovato il contenuto che cercavi</p>
				<Button as={Link} href='/' theme={customButtonTheme} outline>
					Torna alla home
				</Button>
			</div>
		</MainWrapper>
	)
}
