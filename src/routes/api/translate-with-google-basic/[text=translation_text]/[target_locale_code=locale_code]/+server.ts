import { logger } from '$lib/app/logger'
import { LocaleCode } from '$lib/locale/locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { Translate } from '@google-cloud/translate/build/src/v2'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const translation_text = new TranslationText(params['text'])
		const target_locale_code = new LocaleCode(params['target_locale_code'])

		const translate = new Translate()
		const [translations] = await translate.translate(translation_text.text, target_locale_code.code)

		if (!translations) return json('')

		return json(translations)
	} catch (error) {
		logger.error(`[Google] Failed to translate: ${params['text']}]`, error)

		return json('')
	}
}
