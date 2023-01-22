import type { TextId } from "$lib/general/text_id";
import type { SpeechLanguageCode } from "$lib/speech/speech_language_code";
import type { TranslationText } from "$lib/translation/translation_text";
import { Api } from "../api/api";
import { ApiPath } from "../api/api_path";

export class AddTranslationApi {
	private readonly _api_path: ApiPath

	public constructor(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode,
		translation_text: TranslationText,
		private readonly _origin = ''
	) {
		this._api_path = ApiPath.api_directory
			.connect('add-translation')
			.connect(text_id.id.toString())
			.connect(to_speech_language_code.code)
			.connect_with_encoding(translation_text.text)
	}

	public async fetch(): Promise<TranslationText> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<TranslationText>()
	}
}