import { LanguageDb } from '$lib/language/language_db'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const language_db = new LanguageDb()
	const languages = await language_db.find_many()
	const response = json(languages)

	return response
}
