import type { Api } from "./api"

export class ApiPath {
	private readonly _api_path: undefined

	public static readonly api_directory = new ApiPath().connect('api')

	private constructor(private readonly _path = '') {}

	public connect(path: string): ApiPath {
		const connected_path = `${this._path}/${path}`

		return new ApiPath(connected_path)
	}

	public connect_with_encoding(value: string): ApiPath {
		const encoded_path = encodeURIComponent(value.toString())
		const api_path = this.connect(encoded_path)

		return api_path
	}

	public get_url(api?: Api): string {
		const origin = api?.origin ?? ''

		return `${origin}${this._path}`
	}

	public connect_with_params(params: Record<string, string>): ApiPath {
		const filtered_params = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

		const query = new URLSearchParams(filtered_params).toString()
		const connected_path = `${this._path}?${query}`

		return new ApiPath(connected_path)
	}
}