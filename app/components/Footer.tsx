import React from 'react'
import {
	Footer,
	FooterBrand,
	FooterCopyright,
	FooterDivider,
	FooterIcon,
	FooterLink,
	FooterLinkGroup,
	FooterTitle,
} from 'flowbite-react'
import {
	BsDribbble,
	BsFacebook,
	BsGithub,
	BsInstagram,
	BsTwitterX,
	BsLinkedin,
} from 'react-icons/bs'
export default function MyFooter() {
	return (
		<Footer container className='bg-neutral-200 dark:bg-neutral-600 mt-6 rounded-none'>
			<div className='w-full'>
				<div className='grid w-full justify-center sm:flex md:flex md:grid-cols-1'>
					<div className='grid grid-cols-1 gap-8 sm:mt-4 sm:grid-cols-2 sm:gap-6'>
						<div>
							<FooterTitle title='Seguimi' />
							<FooterLinkGroup col>
								<FooterLink href='https://www.linkedin.com/in/mattiaconsiglio/' target='_bank'>
									Linkedin
								</FooterLink>
								<FooterLink href='https://github.com/mattia-consiglio' target='_bank'>
									Github
								</FooterLink>
								<FooterLink href='https://www.facebook.com/mattiaconsiglio96/' target='_bank'>
									Facebook
								</FooterLink>
							</FooterLinkGroup>
						</div>
						<div>
							<FooterTitle title='Legal' />
							<FooterLinkGroup col>
								<FooterLink href='#'>Privacy Policy</FooterLink>
								<FooterLink href='#'>Cookie Policy</FooterLink>
							</FooterLinkGroup>
						</div>
					</div>
				</div>
				<FooterDivider />
				<div className='w-full sm:flex sm:items-center sm:justify-between'>
					<FooterCopyright by='Cositech' year={new Date().getFullYear()} />
					<div className='mt-4 flex space-x-6 sm:mt-0 sm:justify-center'>
						<FooterIcon
							href='https://www.linkedin.com/in/mattiaconsiglio/'
							target='_bank'
							icon={BsLinkedin}
							className='dark:text-neutral-400'
						/>
						<FooterIcon
							href='https://github.com/mattia-consiglio'
							target='_bank'
							icon={BsGithub}
							className='dark:text-neutral-400'
						/>
						<FooterIcon
							href='https://www.facebook.com/mattiaconsiglio96/'
							target='_bank'
							icon={BsFacebook}
							className='dark:text-neutral-400'
						/>
					</div>
				</div>
			</div>
		</Footer>
	)
}
