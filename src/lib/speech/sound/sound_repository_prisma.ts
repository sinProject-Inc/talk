import type { LocaleCode } from '$lib/language/locale_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { PrismaClient, Sound } from '@prisma/client'
import type { SoundRepository } from './sound_repository'

export class SoundRepositoryPrisma implements SoundRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async save(locale_code: LocaleCode, speech_text: SpeechText): Promise<Sound> {
		const locale = await this._prisma_client.locale.findUnique({
			where: { code: locale_code.code },
		})

		if (!locale) throw new Error('locale not found')

		const locale_id = locale.id

		const sound = await this._prisma_client.sound.upsert({
			where: {
				locale_id_sound_text: {
					locale_id,
					sound_text: speech_text.text,
				},
			},
			update: {},
			create: { locale_id, sound_text: speech_text.text },
		})

		return sound
	}

	public async find_first(locale_code: LocaleCode, speech_text: SpeechText): Promise<Sound | null> {
		const sound = await this._prisma_client.sound.findFirst({
			where: { sound_text: speech_text.text, locale: { code: locale_code.code } },
		})

		return sound
	}
}
