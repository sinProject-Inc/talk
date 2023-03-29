import type { LocaleCode } from '$lib/locale/locale_code'
import type { PrismaClient } from '@prisma/client'
import type { VoiceLocale, VoiceRepository } from './voice_repository'

export class VoiceRepositoryPrisma implements VoiceRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_first_by_locale_code(locale_code: LocaleCode): Promise<VoiceLocale | null> {
		const voice = await this._prisma_client.voice.findFirst({
			where: { locale: { code: locale_code.code } },
			include: {
				locale: true,
			},
		})

		return voice
	}
}
