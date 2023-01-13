import { Database } from '$lib/database'
import { SpeechLanguageCode } from '$lib/value/value_object/string_value_object/speech_language_code'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const language_code = (params.language_code ?? '').trim()
	const text = (params.text ?? '').trim()

	if (text === '' || language_code === '') {
		return new Response('text or language_code is empty', { status: 400 })
	}

	try {
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const result = await Database.text_upsert(speech_language_code, text)

		return json(result)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
