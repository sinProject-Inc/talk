import { LanguageRepositoryPrisma } from '$lib/language/language_repository_prisma'
import type { LanguageRepository } from '$lib/language/language_repository'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const language_repository: LanguageRepository = new LanguageRepositoryPrisma()
	const languages = await language_repository.find_many()
	const response = json(languages)

	return response
}
