import { App } from '$lib/app/app'
import type { Locale } from '@prisma/client'

export class LocaleDb {
	public async find_many(): Promise<Locale[]> {
		const locales = await App.db.locale.findMany()

		return locales
	}
}