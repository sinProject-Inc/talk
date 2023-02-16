import { App } from '$lib/app/app'
import { LanguageRepositoryPrisma } from '$lib/language/language_repository_prisma'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const language_repository = new LanguageRepositoryPrisma(App.prisma_client)
	const languages = await language_repository.find_many()
	const response = json(languages)

	return response
}
