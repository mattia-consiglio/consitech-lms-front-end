import { getCookie } from '@/app/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
const OriginUrl = process.env.NEXT_PUBLIC_API_ORIGIN
export class API {
	static readonly baseURL: string = API_URL + '/api/v1'

	static async request<T>(
		endpoint: string,
		method: string,
		body?: BodyInit | object,
		contentType?: string | null,
		signal?: AbortSignal
	): Promise<T> {
		endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint
		endpoint = endpoint.indexOf('/') === endpoint.length - 1 ? endpoint.substring(0, -1) : endpoint
		const headers: { [key: string]: string } = {}
		const jwt = await getCookie('token')

		//get origin url
		const origin =
			typeof window !== 'undefined' && window.location.origin
				? window.location.origin
				: OriginUrl ?? ''

		if (contentType === undefined) {
			contentType = 'application/json'
		}
		if (contentType !== null) {
			headers['Content-Type'] = contentType
		}

		if (jwt) {
			headers['Authorization'] = `Bearer ${jwt.value}`
		}

		headers['Origin'] = origin
		headers['Referer'] = origin

		const getBody = () => {
			if (body && headers['Content-Type'] === 'application/json') {
				return JSON.stringify(body)
			}
			if (body) {
				return body as BodyInit
			}
			return undefined
		}

		const options = {
			method,
			headers,
			body: getBody(),
			signal,
		}

		const res = await fetch(`${this.baseURL}/${endpoint}`, options)
		if (res.ok) {
			if (res.status === 204) {
				return null as T
			}
			return await res.json()
		} else {
			const error = await res.json()
			throw new Error(error.message)
		}
	}

	static async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
		return await API.request<T>(endpoint, 'GET', undefined, undefined, signal)
	}

	static async post<T>(
		endpoint: string,
		body: BodyInit | object,
		contentType?: string | null,
		signal?: AbortSignal
	): Promise<T> {
		return await API.request<T>(endpoint, 'POST', body, contentType, signal)
	}

	static async put<T>(
		endpoint: string,
		body: BodyInit | object,
		contentType?: string | null,
		signal?: AbortSignal
	): Promise<T> {
		return await API.request<T>(endpoint, 'PUT', body, contentType, signal)
	}

	static async delete(endpoint: string, signal?: AbortSignal): Promise<void> {
		const result = await API.request<void>(endpoint, 'DELETE', undefined, undefined, signal)
		return result
	}
}
