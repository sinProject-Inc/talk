import type { Fetch } from '../api/api'
import { AppLocaleCode } from '../language/app_locale_code'
import type { SpeechLanguageCode } from '../speech/speech_language_code'
import { SpeechText } from '../speech/speech_text'
import { TextId } from '../text/text_id'
import type { Text } from '@prisma/client'
import { TranslateWithGoogleAdvancedApi } from './translate_with_google_advanced_api'
import { TranslationText } from './translation_text'
import type { TranslationRepository } from './translation_repository'

export class GetTranslationService {
	public constructor(
		private readonly _translation_repository: TranslationRepository,
		private readonly _text: Text,
		private readonly _target_speech_language_code: SpeechLanguageCode,
		private readonly _fetch: Fetch = fetch,
		private readonly _base_url: string = ''
	) {}

	public async execute(): Promise<Text[]> {
		const text_id = new TextId(this._text.id)

		const found_translations = await this._translation_repository.find_many(
			text_id,
			this._target_speech_language_code
		)

		if (found_translations.length > 0) {
			// console.info('translations found:', found_translations[0].text)
			return found_translations
		}

		const translation_text = new TranslationText(this._text.text)
		const target_app_locale_code = AppLocaleCode.from_speech_language_code(
			this._target_speech_language_code
		)

		const translated_text = await new TranslateWithGoogleAdvancedApi(
			translation_text,
			target_app_locale_code,
			this._fetch,
			this._base_url
		).fetch()

		const translated_speech_text = new SpeechText(translated_text.text)

		try {
			const saved_translation = await this._translation_repository.save(
				text_id,
				this._target_speech_language_code,
				translated_speech_text
			)

			console.info('translation saved:', saved_translation.text)
			return [saved_translation]
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('Unique constraint failed')) {
					console.warn('translation already saved:', translated_speech_text.text)
					return await this.execute()
				}
			}

			throw e
		}
	}
}
