import { logger } from '$lib/app/logger'
import { LocaleCode } from '$lib/locale/locale_code'
import { DeeplTranslator } from '$lib/translation/deepl_translator'
import { TranslationText } from '$lib/translation/translation_text'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TargetLanguageCode } from 'deepl-node'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const translation_text = new TranslationText(params.text)
		const target_locale_code = new LocaleCode(params.target_locale_code?.trim() ?? 'en-US')
		const deepl_translator = new DeeplTranslator(translation_text)
		const translated_text = await deepl_translator.translate(
			target_locale_code.code as TargetLanguageCode
		)

		return json(translated_text.text)
	} catch (error) {
		logger.error(`[DeepL] Failed to translate: ${params.text}]`, error)

		return json('')
	}
}
