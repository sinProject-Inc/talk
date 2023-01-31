
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

	public get_url(origin = ''): string {
		return `${origin}${this._path}`
	}
}