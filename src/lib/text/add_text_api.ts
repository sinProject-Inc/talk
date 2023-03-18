import type { LocaleCode } from '$lib/locale/locale_code'
import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'
import type { BaseText } from './base_text'

export class AddTextApi {
	private readonly _api_path: ApiPath

	public constructor(
		private readonly _locale_code: LocaleCode,
		private readonly _text: BaseText,
	) {
		this._api_path = ApiPath.api_directory
			.connect('add-text')
			.connect(this._locale_code.code)
			.connect_with_encoding(this._text.text)
	}

	public async fetch(): Promise<Text> {
		const api = new Api(this._api_path)
		return await api.fetch<Text>()
	}
}
