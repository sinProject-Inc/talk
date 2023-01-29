import { TextDb } from '$lib/text/text_db'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const text_db = new TextDb()
		const result = await text_db.upsert(speech_language_code, speech_text)

		return json(result)
	} catch (error) {
		console.error(error)
		return json('')
		// return new Response((error as Error).message, { status: 400 })
	}
}
