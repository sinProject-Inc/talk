import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { SpeechText } from '$lib/speech/speech_text'
import { GetTextService } from '$lib/text/get_text_service'
import { GetTranslationService } from '$lib/translation/get_translation_service'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	logger.info(`GET ${url}`)

	try {
		const speech_text = new SpeechText(params.text)
		const source_locale_code = new LocaleCode(params.source_locale_code)
		const target_locale_code = new LocaleCode(params.target_locale_code)

		const get_text_service = new GetTextService(Repository.text, source_locale_code, speech_text)
		const text = await get_text_service.execute()

		const get_translation_service = new GetTranslationService(
			Repository.translation,
			text,
			target_locale_code
		)
		const translations = await get_translation_service.execute()

		return json(translations)
	} catch (e) {
		logger.error(`[database] Failed to get translation: ${params.text}]`, e)
		return new Response((e as Error).message, { status: 400 })
	}
}
