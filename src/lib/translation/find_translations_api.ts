import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'
import type { SpeechLanguageCode } from '../speech/speech_language_code'
import type { TextId } from '../text/text_id'

export class FindTranslationsApi {
	private readonly _api_path: ApiPath

	public constructor(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode,
	) {
		this._api_path = ApiPath.api_directory
			.connect('find-translation')
			.connect(text_id.id.toString())
			.connect(to_speech_language_code.code)
	}

	public async fetch(): Promise<Text[]> {
		const api = new Api(this._api_path)
		return await api.fetch<Text[]>()
	}
}
