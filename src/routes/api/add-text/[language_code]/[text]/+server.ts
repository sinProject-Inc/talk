import { Repository } from '$lib/app/repository'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const result = await Repository.text.save(speech_language_code, speech_text)

		return json(result)
	} catch (error) {
		console.error(error)
		return json('')
		// return new Response((error as Error).message, { status: 400 })
	}
}
