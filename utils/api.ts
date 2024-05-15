import { getCookie } from '@/app/actions'
import { ResponseError } from './types'

export class API {
	static baseURL: string = 'http://localhost:3001/api/v1'

	static async request<T>(
		endpoint: string,
		method: string,
		body?: any
	): Promise<T | ResponseError> {
		endpoint = endpoint.indexOf('/') === 0 ? endpoint.substring(1) : endpoint
		endpoint = endpoint.indexOf('/') === endpoint.length - 1 ? endpoint.substring(0, -1) : endpoint
		const headers: { [key: string]: string } = {}
		const jwt = await getCookie('token')

		headers['Content-Type'] = `application/json`

		if (jwt) {
			headers['Authorization'] = `Bearer ${jwt.value}`
		}
		const res = await fetch(`${this.baseURL}/${endpoint}`, {
			method,
			body: JSON.stringify(body),
			headers,
		})
		return res.json()
	}

	static async get<T>(endpoint: string): Promise<T | ResponseError> {
		return await API.request<T>(endpoint, 'GET')
	}

	static async post<T>(endpoint: string, body: any): Promise<T | ResponseError> {
		return await API.request<T>(endpoint, 'POST', body)
	}

	static async put<T>(endpoint: string, body: any): Promise<T | ResponseError> {
		return await API.request<T>(endpoint, 'PUT', body)
	}

	static async delete<T>(endpoint: string): Promise<T | ResponseError> {
		return await API.request<T>(endpoint, 'DELETE')
	}
}
