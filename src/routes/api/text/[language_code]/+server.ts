import { Database } from '$lib/database'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	const language_code = params.language_code ?? ''

	if (language_code === '') {
		return json({ error: 'language_code is empty' })
	}

	const texts = await Database.get_texts(language_code)
	const texts_json = json(texts)

	return texts_json
}
