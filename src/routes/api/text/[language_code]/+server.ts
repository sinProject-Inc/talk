import { TextRepositoryPrisma } from '$lib/text/text_repository_prisma'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { json, type RequestHandler } from '@sveltejs/kit'
import { TextLimit } from '$lib/text/text_limit'
import type { TextRepository } from '$lib/text/text_repository'

export const GET: RequestHandler = async ({ url, params }): Promise<Response> => {
	console.info(url.href)

	try {
		const speech_language_code = SpeechLanguageCode.create(params.language_code)

		const text_repository: TextRepository = new TextRepositoryPrisma()

		const limit_string = url.searchParams.get('limit')
		const limit = limit_string ? TextLimit.from_string(limit_string) : undefined

		const texts = await text_repository.find_many(speech_language_code, limit)
		const response = json(texts)

		return response
	} catch (error) {
		console.error(error)
		return json({ error: (error as Error).message })
	}
}
