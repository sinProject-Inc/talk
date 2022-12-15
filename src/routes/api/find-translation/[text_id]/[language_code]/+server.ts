import { Database } from '$lib/database'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const text_id = Number((params.text_id ?? '').trim())
	const language_code = (params.language_code ?? '').trim()

	if (isNaN(text_id) || language_code === '') {
		return new Response('text_id or language_to_code is empty', { status: 400 })
	}

	try {
		const result = await Database.find_translation(text_id, language_code)

		return json(result)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
