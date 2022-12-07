
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const trimmed_text = params.text.trim()
	const replaced_text = trimmed_text.replace(/([.!?。！？])(\s+|([^.!?。！？]))/g, '$1\n$3')
	const text_array = replaced_text.split('\n')

	return json(text_array)
}
