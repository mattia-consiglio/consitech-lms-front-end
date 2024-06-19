import { getCookie } from '@/app/actions'
import { ResponseError } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
export class API {
	static baseURL: string = API_URL + '/api/v1'

	static async request<T>(
		endpoint: string,
		method: string,
		body?: any,
		contentType?: string | null
	): Promise<T> {
		endpoint = endpoint.indexOf('/') === 0 ? endpoint.substring(1) : endpoint
		endpoint = endpoint.indexOf('/') === endpoint.length - 1 ? endpoint.substring(0, -1) : endpoint
		const headers: { [key: string]: string } = {}
		const jwt = await getCookie('token')

		if (contentType === undefined) {
			contentType = 'application/json'
		}
		if (contentType !== null) {
			headers['Content-Type'] = contentType
		}

		if (jwt) {
			headers['Authorization'] = `Bearer ${jwt.value}`
		}

		const options = {
			method,
			headers,
			body: body
				? headers['Content-Type'] === 'application/json'
					? JSON.stringify(body)
					: body
				: undefined,
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

	static async get<T>(endpoint: string): Promise<T> {
		return await API.request<T>(endpoint, 'GET')
	}

	static async post<T>(endpoint: string, body: any, contentType?: string | null): Promise<T> {
		return await API.request<T>(endpoint, 'POST', body, contentType)
	}

	static async put<T>(endpoint: string, body: any, contentType?: string | null): Promise<T> {
		return await API.request<T>(endpoint, 'PUT', body, contentType)
	}

	static async delete(endpoint: string): Promise<void> {
		const result = await API.request<void>(endpoint, 'DELETE')
		return result
	}
}
