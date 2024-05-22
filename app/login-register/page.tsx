import MainWrapper from '../components/MainWrapper'
import React from 'react'
import styles from './login.module.scss'
import LoginRegister from './LoginRegister'
import StoreProvider from '@/redux/StoreProvider'

export default function LoginRegisterPage({
	searchParams = {},
}: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	return (
		<MainWrapper className={styles.main}>
			<LoginRegister searchParams={searchParams} />
		</MainWrapper>
	)
}
