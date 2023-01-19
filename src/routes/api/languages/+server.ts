import { Database } from '$lib/general/database'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const languages = await Database.language_find_many()
	const response = json(languages)

	return response
}
