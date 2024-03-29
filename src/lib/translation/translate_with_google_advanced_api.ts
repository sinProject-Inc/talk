import type { LocaleCode } from '$lib/locale/locale_code'
import { Api, type Fetch } from '../api/api'
import { ApiPath } from '../api/api_path'
import { TranslationText } from '../translation/translation_text'

export class TranslateWithGoogleAdvancedApi {
	private readonly _api_path: ApiPath

	public constructor(
		translation_text: TranslationText,
		target_locale_code: LocaleCode,
		private readonly _fetch: Fetch = fetch,
		private readonly _base_url: string = ''
	) {
		this._api_path = ApiPath.api_directory
			.connect('translate-with-google-advanced')
			.connect_with_encoding(translation_text.text)
			.connect(target_locale_code.code)
			.add_base_path(this._base_url)
	}

	public async fetch(): Promise<TranslationText> {
		const api = new Api(this._api_path, this._fetch)
		const result = await api.fetch<string>()
		const translation_text = new TranslationText(result)

		return translation_text
	}
}
