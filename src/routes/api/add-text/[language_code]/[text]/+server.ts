import { Database } from '$lib/database'
import { SpeechLanguageCode } from '$lib/value/value_object/string_value_object/speech_language_code'
import { SpeechText } from '$lib/value/value_object/string_value_object/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const result = await Database.text_upsert(speech_language_code, speech_text)

		return json(result)
	} catch (error) {
		console.error(error)
		return json('')
		// return new Response((error as Error).message, { status: 400 })
	}
}
