
import { Util } from '$lib/util'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const text = params.text ?? ''

	console.info('\nsource text:', text)

	const sentences = Util.split_sentences(text)

	return json(sentences)
}
