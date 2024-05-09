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

export interface AbstactContent {
	id: string
	mainLanguage: MainLanguage
	translations: any[]
	title: string
	slug: string
	description: string
	publishStatus: 'PUBLIC' | 'DRAFT'
	createdAt: Date
	displayOrder: number
	thumbnail: null | Media
	seo: SEO
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

export interface Course extends AbstactContent {
	enrolledStudents: number
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
