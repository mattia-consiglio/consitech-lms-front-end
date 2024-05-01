import Image from 'next/image'
import Navbar from './components/Navbar'
import { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Home',
	description: 'Contetech Home',
}

export default function Home() {
	return (
		<>
			<h1 className='text-7xl'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus cum quos atque possimus nobis
				mollitia quidem nisi odio impedit ipsa enim asperiores inventore eum minima molestias
				repudiandae eaque, expedita amet!
			</h1>
		</>
	)
}
