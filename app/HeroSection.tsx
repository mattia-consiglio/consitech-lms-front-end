'use client'
import { tree } from 'next/dist/build/templates/app-page'
import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import style from './styles/typewriter.module.scss'
import Link from 'next/link'

export default function HeroSection() {
	const [isTyping, setIsTyping] = useState(false)
	return (
		<div className='bg-primary h-[50svh] min-h-[550px] w-full box-border flex flex-col justify-center items-center text-center'>
			<h2 className='text-5xl text-invert_light '>
				Impara{' '}
				<span className={style.typewriter}>
					<Typewriter
						words={['a programmare', 'html', 'css', 'javascript', 'php', 'Bootstrap', 'Wordpress']}
						cursor
						cursorBlinking={isTyping}
						loop={true}
						onType={() => setIsTyping(false)}
						onDelete={() => setIsTyping(false)}
						onDelay={() => setIsTyping(true)}
					/>
				</span>
				<br />
				semplicemente e ovunque
			</h2>
			<Link
				className='bg-invert_light text-invert_dark px-6 py-3 text-xl mt-8 font-bold border-[6px] border-invert_light hover:bg-invert_light/10 hover:text-invert_light transition-all duration-300'
				href='/corsi'
			>
				Scopri i corsi
			</Link>
		</div>
	)
}
