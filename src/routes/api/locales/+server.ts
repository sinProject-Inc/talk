import { Repository } from '$lib/app/repository'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const locales = await Repository.locale.find_many()
	const response = json(locales)

	return response
}
