import { LocaleCode } from '../locale/locale_code'
import { TranslationServiceClient } from '@google-cloud/translate'
import * as dotenv from 'dotenv'
import { TranslationText } from './translation_text'
import { TranslationLanguageCode } from './translation_language_code'
import { logger } from '../app/logger'

// NOTE 言語サポート: https://cloud.google.com/translate/docs/languages?hl=ja

export class TranslateWithGoogleAdvanced {
	private readonly _translation_text: TranslationText
	private readonly _target_locale_code: LocaleCode

	public constructor(text: string | undefined, target_locale_code: string | undefined) {
		this._translation_text = new TranslationText(text)
		this._target_locale_code = new LocaleCode(target_locale_code)
	}

	public async execute(): Promise<string> {
		try {
			const translation_client = new TranslationServiceClient()

			dotenv.config()

			const google_product_id = process.env.GOOGLE_PROJECT_ID

			if (!google_product_id) {
				logger.error('[env] GOOGLE_PROJECT_ID is undefined')

				return ''
			}

			const translation_language_code = new TranslationLanguageCode(this._target_locale_code)

			const request = {
				parent: `projects/${google_product_id}/locations/global`,
				contents: [this._translation_text.text],
				mimeType: 'text/plain',
				// sourceLanguageCode: 'XX',
				targetLanguageCode: translation_language_code.code,
			}

			const [response] = await translation_client.translateText(request)

			if (!response.translations) return ''

			const translated_text_string = response.translations[0].translatedText

			if (!translated_text_string) return ''

			return translated_text_string
		} catch (error) {
			logger.error('[Google Translate] Failed:', error)

			return ''
		}
	}
}
