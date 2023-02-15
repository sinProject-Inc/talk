import { TextId } from '$lib/text/text_id'
import { TranslationRepositoryPrisma } from '$lib/translation/translation_repository_prisma'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TranslationRepository } from '$lib/translation/translation_repository'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const text_id = TextId.from_string(params.text_id)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const translation_repository: TranslationRepository = new TranslationRepositoryPrisma(text_id, speech_language_code)
		const result = await translation_repository.find()

		return json(result)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
