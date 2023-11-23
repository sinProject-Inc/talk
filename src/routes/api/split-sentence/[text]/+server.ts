import { SentenceService } from '$lib/general/sentence_service'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const text = params['text'] ?? ''

	const sentence_service = new SentenceService(text)
	const sentences = sentence_service.split()

	return json(sentences)
}
