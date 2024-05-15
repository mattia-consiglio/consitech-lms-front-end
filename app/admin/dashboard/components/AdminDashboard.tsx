import { Button } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'

export default function AdminDashboard() {
	return (
		<div>
			<Button as={Link} href='/admin/corsi'>
				Corsi
			</Button>
			<Button as={Link} href='/admin/lezioni'>
				Lezioni
			</Button>
		</div>
	)
}
