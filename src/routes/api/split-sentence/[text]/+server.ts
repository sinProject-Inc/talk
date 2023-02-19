
import { SentenceService } from '$lib/general/string_util'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const text = params.text ?? ''

	console.info('\nsource text:', text)

	const sentence_service = new SentenceService(text)
	const sentences = sentence_service.split()

	return json(sentences)
}
