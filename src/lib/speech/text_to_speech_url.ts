import type { LocaleCode } from '$lib/locale/locale_code'
import { ApiPath } from '../api/api_path'

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
			// eslint-disable-next-line no-console
			console.error(error)

			return ''
		}
	}
}
