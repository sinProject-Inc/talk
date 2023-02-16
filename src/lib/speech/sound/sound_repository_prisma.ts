import { App } from '$lib/app/app'
import type { LocaleCode } from '$lib/language/locale_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { Sound } from '@prisma/client'
import type { SoundRepository } from './sound_repository'

export class SoundRepositoryPrisma implements SoundRepository {
	public constructor(
		private readonly _locale_code: LocaleCode,
		private readonly _speech_text: SpeechText
	) {}

	public async save(): Promise<Sound> {
		const locale = await App.db.locale.findUnique({
			where: { code: this._locale_code.code },
		})

		if (!locale) throw new Error('locale not found')

		const locale_id = locale.id

		const sound = await App.db.sound.upsert({
			where: {
				locale_id_sound_text: {
					locale_id,
					sound_text: this._speech_text.text,
				},
			},
			update: {},
			create: { locale_id, sound_text: this._speech_text.text },
		})

		return sound
	}

	public async find_first(): Promise<Sound | null> {
		const sound = await App.db.sound.findFirst({
			where: { sound_text: this._speech_text.text, locale: { code: this._locale_code.code } },
		})

		return sound
	}
}
