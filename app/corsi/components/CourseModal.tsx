'use client'
import { closeModal, openModal } from '@/redux/reducers/modalsSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Modal, Button } from 'flowbite-react'
import React from 'react'

export default function CourseModal() {
	const { isOpen, header, body } = useAppSelector(state => state.modals.course)
	const dispatch = useAppDispatch()
	return (
		<Modal
			show={isOpen}
			position={'center'}
			onClose={() => dispatch(closeModal({ type: 'course' }))}
		>
			{header && <Modal.Header>{header}</Modal.Header>}
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>
				{/* <Button onClick={() => setOpenModal(false)}>I accept</Button>
				<Button color='gray' onClick={() => setOpenModal(false)}>
					Decline
				</Button> */}
			</Modal.Footer>
		</Modal>
	)
}
