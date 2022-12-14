import { Database } from '$lib/database'
import { json, type RequestHandler } from '@sveltejs/kit'



export const GET: RequestHandler = async ({ url, params }) => {
	console.log(url.href)

	const text = (params.text ?? '').trim()
	const language_code = (params.language_code ?? '').trim()

	if (text === '' || language_code === '') {
		return new Response('text or language_code is empty', { status: 400 })
	}

	try {
		const result = await Database.text_upsert(text, language_code)

		return json(result)
	}
	catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
