import type { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import type { Language, PrismaClient } from '@prisma/client'
import type { LanguageRepository } from './language_repository'

export class LanguageRepositoryPrisma implements LanguageRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(): Promise<Language[]> {
		const languages = await this._prisma_client.language.findMany()

		return languages
	}

	public async find_unique(speech_language_code: SpeechLanguageCode): Promise<Language | null> {
		const code = speech_language_code.code
		const language = await this._prisma_client.language.findUnique({ where: { code } })

		return language
	}
}
