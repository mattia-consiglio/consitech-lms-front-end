export interface PagableContent<T> {
	content: T[]
	pageable: Pageable
	last: boolean
	totalPages: number
	totalElements: number
	size: number
	number: number
	sort: Sort
	first: boolean
	numberOfElements: number
	empty: boolean
}

export enum PublishStatus {
	PUBLIC = 'PUBLIC',
	DRAFT = 'DRAFT',
}

export interface AbstactContent {
	id: string
	mainLanguage: MainLanguage
	translations: any[]
	title: string
	slug: string
	description: string
	publishStatus: PublishStatus
	createdAt: Date
	displayOrder: number
	thumbnail: null | Media
	seo: SEO
}
export interface Course extends AbstactContent {
	enrolledStudents: number
}

export interface Lesson extends AbstactContent {
	liveEditor: null
	videoId: null
	videoThumbnail: null
	content: null
	course: Course
}

export interface Media {
	id: string
	url: string
	alt: string
	type: string | 'IMAGE'
	createdAt: Date
	width: number
	height: number
	mainColor: string
}

export interface MainLanguage {
	id: string
	code: string
	language: string
}

export interface SEO {
	id: string
	mainLanguage: MainLanguage
	translations: any[]
	title: string
	description: string
	ldJSON: string
}

export interface Pageable {
	pageNumber: number
	pageSize: number
	sort: Sort
	offset: number
	unpaged: boolean
	paged: boolean
}

export interface Sort {
	empty: boolean
	unsorted: boolean
	sorted: boolean
}

export interface ResponseError {
	timestamp: string
	message: string
	status: number
	error: string
}

export interface Authorization {
	authorization: string
}

export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export interface User {
	id: string
	username: string
	email: string
	role: UserRole
}
