import { LocaleDb } from '$lib/language/locale_db'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const locale_db = new LocaleDb()
	const locales = await locale_db.find_many()
	const response = json(locales)

	return response
}
