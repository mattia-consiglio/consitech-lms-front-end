import MainWrapper from '@/app/components/MainWrapper'
import React from 'react'
interface AdminCouseProps {
	couseId: string
}

export default function AdminCouse({ couseId }: AdminCouseProps) {
	return <MainWrapper>AdminCouse: {couseId}</MainWrapper>
}
