import { App } from '$lib/app/app'
import { LocaleRepositoryPrisma } from '$lib/language/locale_repository_prisma'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const locale_repository = new LocaleRepositoryPrisma(App.prisma_client)
	const locales = await locale_repository.find_many()
	const response = json(locales)

	return response
}
