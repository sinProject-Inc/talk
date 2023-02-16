import { Repository } from '$lib/app/repository'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const languages = await Repository.language.find_many()
	const response = json(languages)

	return response
}
