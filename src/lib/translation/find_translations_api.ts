import type { TextId } from "$lib/text/text_id";
import type { SpeechLanguageCode } from "$lib/speech/speech_language_code";
import type { Text } from "@prisma/client";
import { Api } from "../api/api";
import { ApiPath } from "../api/api_path";

export class FindTranslationsApi {
	private readonly _api_path: ApiPath

	public constructor(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode,
		private readonly _origin = ''
	) {
		this._api_path = ApiPath.api_directory
			.connect('find-translation')
			.connect(text_id.id.toString())
			.connect(to_speech_language_code.code)
	}

	public async fetch(): Promise<Text[]> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<Text[]>()
	}
}