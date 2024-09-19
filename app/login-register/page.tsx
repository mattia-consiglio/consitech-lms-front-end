import MainWrapper from "../components/MainWrapper"
import React from "react"
import styles from "./login.module.scss"
import LoginRegister from "./LoginRegister"

export default function LoginRegisterPage({
	searchParams = {},
}: Readonly<{
	searchParams?: { [key: string]: string | string[] | undefined }
}>) {
	return (
		<MainWrapper className={styles.main}>
			<LoginRegister searchParams={searchParams} />
		</MainWrapper>
	)
}
