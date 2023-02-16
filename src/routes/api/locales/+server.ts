import type { LocaleRepository } from '$lib/language/locale_repository'
import { LocaleRepositoryPrisma } from '$lib/language/locale_repository_prisma'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const locale_repository: LocaleRepository = new LocaleRepositoryPrisma()
	const locales = await locale_repository.find_many()
	const response = json(locales)

	return response
}
