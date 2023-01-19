import { TextId } from '$lib/general/text_id'
import { Database } from '$lib/general/database'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const text_id = TextId.from_string(params.text_id)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const result = await Database.find_translation(text_id, speech_language_code)

		return json(result)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
