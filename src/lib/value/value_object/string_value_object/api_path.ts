import { StringValueObject } from "../string_value_object"

export class ApiPath extends StringValueObject {
	public static readonly api_directory = new ApiPath().connect('api')

	public static readonly text = ApiPath.api_directory.connect('text')
	public static readonly languages = ApiPath.api_directory.connect('languages')
	public static readonly locales = ApiPath.api_directory.connect('locales')
	public static readonly text_to_speech = ApiPath.api_directory.connect('text-to-speech')
	public static readonly translate_by_google_basic = ApiPath.api_directory.connect(
		'translate-by-google-basic'
	)
	public static readonly translate_by_google_advanced = ApiPath.api_directory.connect(
		'translate-by-google-advanced'
	)
	public static readonly add_text = ApiPath.api_directory.connect('add-text')
	public static readonly add_translation = ApiPath.api_directory.connect('add-translation')
	public static readonly find_translation = ApiPath.api_directory.connect('find-translation')

	private constructor(value = '') {
		super(`${value}`)
	}

	public connect(path: string | object): ApiPath {
		const connected_path = `${this._value}/${path}`

		return new ApiPath(connected_path)
	}

	public connect_with_encoding(value: string | object): ApiPath {
		const encoded_path = encodeURIComponent(value.toString())
		const api_path = this.connect(encoded_path)

		return api_path
	}

	public get_url(origin = ''): string {
		return `${origin}${this._value}`
	}
}