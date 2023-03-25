import type { LocaleCode } from '../locale/locale_code'
import type { Text } from '@prisma/client'
import { SpeechText } from '../speech/speech_text'
import { TextId } from '../text/text_id'
import { TranslateWithGoogleAdvanced } from './translate_with_google_advanced'
import type { TranslationRepository } from './translation_repository'
import { logger } from '../app/logger'

export class GetTranslationService {
	public constructor(
		private readonly _translation_repository: TranslationRepository,
		private readonly _text: Text,
		private readonly _target_locale_code: LocaleCode
	) {}

	public async execute(): Promise<Text[]> {
		const text_id = new TextId(this._text.id)

		const found_translations = await this._translation_repository.find_many(
			text_id,
			this._target_locale_code
		)

		if (found_translations.length > 0) return found_translations

		const translate_with_google_advanced = new TranslateWithGoogleAdvanced(
			this._text.text,
			this._target_locale_code.code
		)
		const translated_text = await translate_with_google_advanced.execute()
		const translated_speech_text = new SpeechText(translated_text)

		try {
			const saved_translation = await this._translation_repository.save(
				text_id,
				this._target_locale_code,
				translated_speech_text
			)

			logger.info(`[database] translation saved: ${saved_translation.text}`)

			return [saved_translation]
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('Unique constraint failed')) {
					logger.warn(`[database] translation already saved: ${translated_speech_text.text}`)
					return await this.execute()
				}
			}

			throw e
		}
	}
}
