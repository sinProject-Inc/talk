import { App } from '$lib/app/app'
import type { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { Text } from '@prisma/client'
import { LanguageDb } from '../language/language_db'
import type { TextId } from './text_id'
import type { TextLimit } from './text_limit'

export class TextDb {
	public async find(text_id: TextId): Promise<Text | null> {
		const text = await App.db.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async find_many(speech_language_code: SpeechLanguageCode, limit?: TextLimit): Promise<Text[]> {
		const texts = await App.db.text.findMany({
			where: { language: { code: speech_language_code.code } },
			orderBy: { updated_at: 'desc' },
			// TODO: Make this more readable
			...(limit && { take: limit.limit }), 
		})

		return texts
	}

	public async find_unique(text_id: TextId): Promise<Text | null> {
		const text = await App.db.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async upsert(
		speech_language_code: SpeechLanguageCode,
		speech_text: SpeechText
	): Promise<Text> {
		const language_db = new LanguageDb()
		const language = await language_db.find_unique(speech_language_code)

		if (!language) throw new Error('language not found')

		const language_id = language.id

		const result = await App.db.text.upsert({
			where: {
				language_id_text: {
					language_id,
					text: speech_text.text,
				},
			},
			update: { updated_at: new Date() },
			create: { language_id, text: speech_text.text },
		})

		return result
	}
}
