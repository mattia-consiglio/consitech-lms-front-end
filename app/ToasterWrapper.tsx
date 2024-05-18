'use client'
import React from 'react'
import toast, { Toaster, ToastBar } from 'react-hot-toast'

export default function ToasterWrpper() {
	return (
		<Toaster
			position='bottom-right'
			toastOptions={{
				className: 'toast',
				success: {
					duration: 5000,
				},
				error: {
					duration: 10000,
				},
				style: {
					padding: '0',
				},
			}}
		>
			{t => (
				<ToastBar toast={t}>
					{({ icon, message }) => (
						<>
							<div className='flex items-center justify-between break-words'>
								<div className='flex items-center'>
									{icon}
									<div>{message}</div>
								</div>
								<button
									onClick={() => {
										toast.dismiss(t.id)
									}}
									style={{ float: 'right' }}
								>
									x
								</button>
							</div>
						</>
					)}
				</ToastBar>
			)}
		</Toaster>
	)
}
