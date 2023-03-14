import type { Text } from '@prisma/client'
import type { SpeechLanguageCode } from '../speech/speech_language_code'
import { SpeechText } from '../speech/speech_text'
import { TextId } from '../text/text_id'
import { TranslateWithGoogleAdvanced } from './translate_with_google_advanced'
import type { TranslationRepository } from './translation_repository'

export class GetTranslationService {
	public constructor(
		private readonly _translation_repository: TranslationRepository,
		private readonly _text: Text,
		private readonly _target_speech_language_code: SpeechLanguageCode,
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

		const translate_with_google_advanced = new TranslateWithGoogleAdvanced(
			this._text.text,
			this._target_speech_language_code.code
		)
		const translated_text = await translate_with_google_advanced.execute()
		const translated_speech_text = new SpeechText(translated_text)

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
