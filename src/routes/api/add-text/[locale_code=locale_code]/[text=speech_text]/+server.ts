import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { SpeechText } from '$lib/speech/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const speech_text = new SpeechText(params.text)
		const locale_code = new LocaleCode(params.locale_code)
		const result = await Repository.text.save(locale_code, speech_text)

		return json(result)
	} catch (error) {
		logger.error(`[DB] Failed to save text: ${params.text}]`, error)

		return json('')
		// return new Response((error as Error).message, { status: 400 })
	}
}
