import type { Language, Locale, Text } from '@prisma/client'
import type { TextId } from './value/value_object/number_value_object/text_id'
import type { AppLocaleCode } from './value/value_object/string_value_object/app_locale_code'
import type { LocaleCode } from './value/value_object/string_value_object/locale_code'
import type { SpeechLanguageCode } from './value/value_object/string_value_object/speech_language_code'

export class Api {
	public constructor(private readonly _origin = '') {}

	private async _fetch<T>(path: string): Promise<T> {
		const response = await fetch(`${this._origin}${path}`)
		const result = (await response.json()) as T

		return result
	}

	public async texts(speech_language_code: SpeechLanguageCode): Promise<Text[]> {
		return await this._fetch<Text[]>(`/api/text/${speech_language_code}`)
	}

	public async languages(): Promise<Language[]> {
		return await this._fetch<Language[]>('/api/languages')
	}

	public async locales(): Promise<Locale[]> {
		return await this._fetch<Locale[]>('/api/locales')
	}

	public get_text_to_speech_url(selected_text: string, locale_code: LocaleCode): string {
		if (selected_text === '') return ''

		const encoded_text = encodeURIComponent(selected_text)
		const url = `/api/text-to-speech/${encoded_text}/${locale_code}`

		return url
	}

	public async translate_by_google_basic(text: string, target_language_code: string): Promise<string> {
		if (text === '' || target_language_code === '') return ''

		const encoded_text = encodeURIComponent(text)
		const url = `/api/translate-by-google-basic/${encoded_text}/${target_language_code}`
		const result = await this._fetch<string>(url)

		return result
	}

	public async translate_by_google_advanced(text: string, app_locale_code: AppLocaleCode): Promise<string> {
		if (text === '') return ''

		const encoded_text = encodeURIComponent(text)
		const url = `/api/translate-by-google-advanced/${encoded_text}/${app_locale_code}`
		const result = await this._fetch<string>(url)

		return result
	}

	public async add_text(language_code: SpeechLanguageCode, text: string): Promise<Text> {
		const encoded_text = encodeURIComponent(text)
		const result = await this._fetch<Text>(`/api/add-text/${language_code}/${encoded_text}`)

		return result
	}

	public async add_translation(
		text_id: TextId,
		to_speech_language_code: SpeechLanguageCode,
		translation: string
	): Promise<Text> {
		const encoded_translation = translation
		const result = await this._fetch<Text>(
			`/api/add-translation/${text_id}/${to_speech_language_code}/${encoded_translation}`
		)

		return result
	}

	public async find_translation(text_id: TextId, to_speech_language_code: SpeechLanguageCode): Promise<Text[]> {
		return await this._fetch<Text[]>(`/api/find-translation/${text_id}/${to_speech_language_code}`)
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
