import { App } from '$lib/app/app'
import type { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import type { Language } from '@prisma/client'

export class LanguageDb {
	public async find_many(): Promise<Language[]> {
		const languages = await App.db.language.findMany()

		return languages
	}

	public async find_unique(
		speech_language_code: SpeechLanguageCode
	): Promise<Language | null> {
		const code = speech_language_code.code
		const language = await App.db.language.findUnique({ where: { code } })

		return language
	}
}
