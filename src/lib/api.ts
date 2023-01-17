import type { Language, Locale, Text } from '@prisma/client'
import type { TextId } from './value/value_object/number_value_object/text_id'
import { ApiPath } from './value/value_object/string_value_object/api_path'
import type { AppLocaleCode } from './value/value_object/string_value_object/app_locale_code'
import type { LocaleCode } from './value/value_object/string_value_object/locale_code'
import type { SpeechLanguageCode } from './value/value_object/string_value_object/speech_language_code'
import { SpeechText } from './value/value_object/string_value_object/text_value_object/speech_text'
import { TranslationText } from './value/value_object/string_value_object/text_value_object/translation_text'

export class Api {
	public constructor(private readonly _origin = '') {}

	private async _fetch<T>(api_path: ApiPath): Promise<T> {
		const url = api_path.get_url(this._origin)
		const response = await fetch(url)
		const result = (await response.json()) as T

		return result
	}

	public async texts(speech_language_code: SpeechLanguageCode): Promise<Text[]> {
		const api_path = ApiPath.text.connect(speech_language_code)

		return await this._fetch<Text[]>(api_path)
	}

	public async languages(): Promise<Language[]> {
		return await this._fetch<Language[]>(ApiPath.languages)
	}

	public async locales(): Promise<Locale[]> {
		return await this._fetch<Locale[]>(ApiPath.locales)
	}

	public get_text_to_speech_url(selected_text: string, locale_code: LocaleCode): string {
		try {
			const speech_text = new SpeechText(selected_text)
			const api_path = ApiPath.text_to_speech
				.connect_with_encoding(speech_text)
				.connect(locale_code)

			return api_path.string
		} catch (error) {
			console.error(error)
			return ''
		}
	}

	public async translate_by_google_basic(
		translation_text: TranslationText,
		target_app_locale_code: AppLocaleCode
	): Promise<TranslationText> {
		const api_path = ApiPath.translate_by_google_basic
			.connect_with_encoding(translation_text)
			.connect(target_app_locale_code)

		const translated_text = await this._fetch<TranslationText>(api_path)

		return translated_text
	}

	public async translate_by_google_advanced(
		translation_text: TranslationText,
		target_app_locale_code: AppLocaleCode
	): Promise<TranslationText> {
		const api_path = ApiPath.translate_by_google_advanced
			.connect_with_encoding(translation_text)
			.connect(target_app_locale_code)

		const result = await this._fetch<string>(api_path)
		const translated_text = new TranslationText(result)

		return translated_text
	}

	public async add_text(language_code: SpeechLanguageCode, speech_text: SpeechText): Promise<Text> {
		const api_path = ApiPath.add_text.connect(language_code).connect_with_encoding(speech_text)
		const result = await this._fetch<Text>(api_path)

		return result
	}

	public async add_translation(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode,
		translation_text: TranslationText
	): Promise<Text> {
		const api_path = ApiPath.add_translation
			.connect(text_id)
			.connect(to_speech_language_code)
			.connect_with_encoding(translation_text)

		const result = await this._fetch<Text>(api_path)

		return result
	}

	public async find_translation(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode
	): Promise<Text[]> {
		const app_path = ApiPath.find_translation.connect(text_id).connect(to_speech_language_code)

		return await this._fetch<Text[]>(app_path)
	}

	// HACK: 結合方法不明のため保留
	// async function split_sentences(text: string, url: URL): Promise<string[]> {
	// 	const split_response = await fetch(`${url.origin}/api/split-sentence/${text}`)
	// 	const sentences = (await split_response.json()) as string[]

	// 	return sentences
	// }

	// public static async split_sentences(text: string): Promise<string[]> {
	// 	const response = await fetch(`/api/split-sentence/${text}`)
	// 	const sentences = (await response.json()) as string[]

	// 	return sentences
	// }

	// public static async sound_upsert(sound_text: string, locale_id: number): Promise<number> {
	// 	const response = await fetch(`/api/sound-upsert/${sound_text}/${locale_id}`, { method: 'POST' })
	// 	const sound_id = await response.json()

	// 	return sound_id
	// }
}
