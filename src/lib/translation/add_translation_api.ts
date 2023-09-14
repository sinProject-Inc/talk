import type { LocaleCode } from '$lib/locale/locale_code'
import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'
import type { TextId } from '../text/text_id'
import type { TranslationText } from '../translation/translation_text'

export class AddTranslationApi {
	private readonly _api_path: ApiPath

	public constructor(
		text_id: TextId,
		to_locale_code: LocaleCode,
		translation_text: TranslationText
	) {
		this._api_path = ApiPath.api_directory
			.connect('add-translation')
			.connect(text_id.id.toString())
			.connect(to_locale_code.code)
			.connect_with_encoding(translation_text.text)
	}

	public async fetch(): Promise<Text> {
		const api = new Api(this._api_path)

		return await api.fetch<Text>()
	}
}
