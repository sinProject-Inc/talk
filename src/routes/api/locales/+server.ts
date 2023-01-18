import { Database } from '$lib/static/database'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const locales = await Database.locale_find_many()
	const response = json(locales)

	return response
}
