import type { Locale, PrismaClient } from '@prisma/client'
import type { LocaleCode } from './locale_code'
import type { LocaleRepository } from './locale_repository'

export class LocaleRepositoryPrisma implements LocaleRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(): Promise<Locale[]> {
		const locales = await this._prisma_client.locale.findMany()

		return locales
	}

	public async find_unique(locale_code: LocaleCode): Promise<Locale | null> {
		const code = locale_code.code
		const locale = await this._prisma_client.locale.findUnique({ where: { code } })

		return locale
	}
}
