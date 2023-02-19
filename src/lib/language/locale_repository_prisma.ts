import type { Locale, PrismaClient } from '@prisma/client'
import type { LocaleRepository } from './locale_repository'

export class LocaleRepositoryPrisma implements LocaleRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(): Promise<Locale[]> {
		const locales = await this._prisma_client.locale.findMany()

		return locales
	}
}