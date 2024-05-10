export class API {
	static baseURL: string = 'http://localhost:3001/api/v1'

	static async request(endpoint: string, method: string, body?: any) {
		endpoint = endpoint.indexOf('/') === 0 ? endpoint.substring(1) : endpoint
		endpoint = endpoint.indexOf('/') === endpoint.length - 1 ? endpoint.substring(0, -1) : endpoint
		const res = await fetch(`${this.baseURL}/${endpoint}`, {
			method,
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return res.json()
	}

	static async get(endpoint: string) {
		return await API.request(endpoint, 'GET')
	}

	static async post(endpoint: string, body: any) {
		return await API.request(endpoint, 'POST', body)
	}

	static async put(endpoint: string, body: any) {
		return await API.request(endpoint, 'PUT', body)
	}

	static async delete(endpoint: string) {
		return await API.request(endpoint, 'DELETE')
	}
}
