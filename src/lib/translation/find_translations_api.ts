import type { LocaleCode } from '$lib/locale/locale_code'
import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'
import type { TextId } from '../text/text_id'

export class FindTranslationsApi {
	private readonly _api_path: ApiPath

	public constructor(text_id: TextId, to_locale_code: LocaleCode) {
		this._api_path = ApiPath.api_directory
			.connect('find-translation')
			.connect(text_id.id.toString())
			.connect(to_locale_code.code)
	}

	public async fetch(): Promise<Text[]> {
		const api = new Api(this._api_path)
		return await api.fetch<Text[]>()
	}
}
