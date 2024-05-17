import MainWrapper from '@/app/components/MainWrapper'
import { customButtonTheme } from '@/app/flowbite.themes'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'

export default function AdminDashboard() {
	return (
		<MainWrapper>
			<div className='flex gap-4 justify-center'>
				<Button as={Link} href='/admin/corsi' theme={customButtonTheme} outline>
					Corsi
				</Button>
				<Button as={Link} href='/admin/lezioni' theme={customButtonTheme} outline>
					Lezioni
				</Button>
			</div>
		</MainWrapper>
	)
}
