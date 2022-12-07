
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	console.info('\nsource text:', params.text)

	const trimmed_text = params.text?.trim() ?? ''
	const replaced_text = trimmed_text.replace(/([.!?。！？])(\s+|([^.!?。！？]))/g, '$1\n$3')
	const sentences = replaced_text.split('\n')

	for (const sentence of sentences) {
		console.info(sentence)
	}

	return json(sentences)
}
