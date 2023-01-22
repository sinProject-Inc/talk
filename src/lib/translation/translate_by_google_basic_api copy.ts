import type { AppLocaleCode } from "$lib/language/app_locale_code";
import type { TranslationText } from "$lib/translation/translation_text";
import { Api } from "../api/api";
import { ApiPath } from "../api/api_path";

export class TranslateByGoogleBasicApi {
	private readonly _api_path: ApiPath

	public constructor(translation_text: TranslationText, target_app_locale_code: AppLocaleCode, private readonly _origin = '') {
		this._api_path = ApiPath.api_directory
			.connect('translate-by-google-basic')
			.connect_with_encoding(translation_text.text)
			.connect(target_app_locale_code.code)
	}

	public async fetch(): Promise<TranslationText> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<TranslationText>()
	}
}