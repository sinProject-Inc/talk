import { Repository } from '$lib/app/repository'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { GetTextService } from '$lib/text/get_text_service'
import { GetTranslationService } from '$lib/translation/get_translation_service'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params, fetch }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const source_speech_language_code = SpeechLanguageCode.create(params.source_language_code)
		const target_speech_language_code = SpeechLanguageCode.create(params.target_language_code)

		const get_text_service = new GetTextService(
			Repository.text,
			source_speech_language_code,
			speech_text
		)
		const text = await get_text_service.execute()

		const get_translation_service = new GetTranslationService(
			Repository.translation,
			text,
			target_speech_language_code,
			fetch
		)
		const translations = await get_translation_service.execute()

		return json(translations)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
