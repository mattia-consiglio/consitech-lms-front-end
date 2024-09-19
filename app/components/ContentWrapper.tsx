import type React from "react"

interface ContentWrapperProps {
	children: React.ReactNode
}

export default function ContentWrapper({
	children,
}: Readonly<ContentWrapperProps>) {
	return (
		<div
			className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
			style={{ minWidth: "min(700px,calc(100svw - 1rem))" }}
		>
			<div className="w-full">{children}</div>
		</div>
	)
}
