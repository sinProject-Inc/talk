import { ApiPath } from '../api/api_path'
import type { LocaleCode } from '../language/locale_code'

export class TextToSpeechUrl {
	public constructor(
		// TODO: Value Object
		private readonly _value: string,
		private readonly _locale_code: LocaleCode
	) {}

	public get url(): string {
		try {
			const api_path = ApiPath.api_directory
				.connect('text-to-speech')
				.connect_with_encoding(this._value)
				.connect(this._locale_code.code)
			return api_path.path()
		} catch (error) {
			console.error(error)
			return ''
		}
	}
}
