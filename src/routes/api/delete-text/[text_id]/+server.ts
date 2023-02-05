import { TextDb } from '$lib/text/text_db'
import { json, type RequestHandler } from '@sveltejs/kit'
import { TextId } from '$lib/text/text_id'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const text_db = new TextDb()
		const text_id = TextId.from_string(params.text_id)

		const result = await text_db.delete(text_id)
		
		return json(result)
	} catch (error) {
		console.error(error)
		return new Response((error as Error).message, { status: 400 })
	}
}
