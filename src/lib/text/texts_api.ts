import type { SpeechLanguageCode } from '../speech/speech_language_code'
import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'

export class TextsApi {
	private readonly _api_path: ApiPath

	public constructor(speech_language_code: SpeechLanguageCode, private readonly _origin = '') {
		this._api_path = ApiPath.api_directory.connect('text').connect(speech_language_code.code)
	}

	public async fetch(): Promise<Text[]> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<Text[]>()
	}
}
