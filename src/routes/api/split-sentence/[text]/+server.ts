
import { StringUtil } from '$lib/general/string_util'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const text = params.text ?? ''

	console.info('\nsource text:', text)

	const sentences = StringUtil.split_sentences(text)

	return json(sentences)
}
