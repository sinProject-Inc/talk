import { TextRepositoryPrisma } from '$lib/text/text_repository_prisma'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TextRepository } from '$lib/text/text_repository'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const text_repository: TextRepository = new TextRepositoryPrisma()
		const result = await text_repository.upsert(speech_language_code, speech_text)

		return json(result)
	} catch (error) {
		console.error(error)
		return json('')
		// return new Response((error as Error).message, { status: 400 })
	}
}
