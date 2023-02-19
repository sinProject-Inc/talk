import { Repository } from '$lib/app/repository'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { TextLimit } from '$lib/text/text_limit'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }): Promise<Response> => {
	console.info(url.href)

	try {
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const limit_string = url.searchParams.get('limit')
		const limit = limit_string ? TextLimit.from_string(limit_string) : undefined

		const texts = await Repository.text.find_many(speech_language_code, limit)
		const response = json(texts)

		return response
	} catch (error) {
		console.error(error)
		return json({ error: (error as Error).message })
	}
}
