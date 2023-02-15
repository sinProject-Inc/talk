import { App } from '$lib/app/app'
import type { Locale } from '@prisma/client'
import type { LocaleRepository } from './locale_repository'

export class LocaleRepositoryPrisma implements LocaleRepository  {
	public async find_many(): Promise<Locale[]> {
		const locales = await App.db.locale.findMany()

		return locales
	}
}