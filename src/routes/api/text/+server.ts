import { db } from '$lib/database'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
	const language_code = url.searchParams.get('language_code') ?? ''

	const texts = await db.text.findMany({ where: { language: { code: language_code } } })
	const texts_json = json(texts)

	return texts_json
}
