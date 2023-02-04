import { TextDb } from '$lib/text/text_db'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }): Promise<Response> => {
	console.info(url.href)

	try {
		const speech_language_code = SpeechLanguageCode.create(params.language_code)

		const text_db = new TextDb()
		const texts = await text_db.find_many(speech_language_code)
		const response = json(texts)

		return response
	} catch (error) {
		console.error(error)
		return json({ error: (error as Error).message })
	}
}
