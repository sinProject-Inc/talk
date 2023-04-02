export class ApiPath {
	public static readonly api_directory = new ApiPath().connect('api')

	private constructor(private readonly _path = '') {}

	public connect(path: string): ApiPath {
		const connected_path = `${this._path}/${path}`

		return new ApiPath(connected_path)
	}

	public add_base_path(base_path: string): ApiPath {
		if (!base_path) return this

		const connected_path = `${base_path}${this._path}`
		const api_path = new ApiPath(connected_path)

		return api_path
	}

	public connect_with_encoding(value: string): ApiPath {
		const encoded_path = encodeURIComponent(value.toString())
		const api_path = this.connect(encoded_path)

		return api_path
	}

	public connect_with_params(params: Record<string, string>): ApiPath {
		// TODO: Do not use Record

		const filtered_params = Object.fromEntries(
			Object.entries(params).filter(([, value]) => value !== '')
		)

		if (Object.keys(filtered_params).length === 0) {
			return this
		}

		const query = new URLSearchParams(filtered_params).toString()
		const connected_path = `${this._path}?${query}`

		return new ApiPath(connected_path)
	}

	public path(): string {
		return this._path
	}
}
