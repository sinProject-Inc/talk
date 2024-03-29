import type { LocaleCode } from '$lib/locale/locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'

export class TranslateWithGoogleBasicApi {
	private readonly _api_path: ApiPath

	public constructor(translation_text: TranslationText, target_locale_code: LocaleCode) {
		this._api_path = ApiPath.api_directory
			.connect('translate-with-google-basic')
			.connect_with_encoding(translation_text.text)
			.connect(target_locale_code.code)
	}

	public async fetch(): Promise<TranslationText> {
		const api = new Api(this._api_path)
		const result = await api.fetch<string>()
		const translation_text = new TranslationText(result)

		return translation_text
	}
}
