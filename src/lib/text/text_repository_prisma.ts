import type { LanguageRepository } from '$lib/language/language_repository'
import type { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { PrismaClient, Text } from '@prisma/client'
import { LanguageRepositoryPrisma } from '../language/language_repository_prisma'
import type { TextId } from './text_id'
import type { TextLimit } from './text_limit'
import type { TextRepository } from './text_repository'

export class TextRepositoryPrisma implements TextRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find(text_id: TextId): Promise<Text | null> {
		const text = await this._prisma_client.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async find_many(
		speech_language_code: SpeechLanguageCode,
		limit?: TextLimit
	): Promise<Text[]> {
		const texts = await this._prisma_client.text.findMany({
			where: { language: { code: speech_language_code.code } },
			orderBy: { updated_at: 'desc' },
			// TODO: Make this more readable
			...(limit && { take: limit.limit }),
		})

		return texts
	}

	public async find_unique(text_id: TextId): Promise<Text | null> {
		const text = await this._prisma_client.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async save(
		speech_language_code: SpeechLanguageCode,
		speech_text: SpeechText
	): Promise<Text> {
		const language_repository: LanguageRepository = new LanguageRepositoryPrisma(this._prisma_client)
		const language = await language_repository.find_unique(speech_language_code)

		if (!language) throw new Error('language not found')

		const language_id = language.id

		const result = await this._prisma_client.text.upsert({
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

	public async delete(text_id: TextId): Promise<Text> {
		await this._prisma_client.textToText.deleteMany({ where: { text_id_1: text_id.id } })
		await this._prisma_client.textToText.deleteMany({ where: { text_id_2: text_id.id } })

		const result = await this._prisma_client.text.delete({ where: { id: text_id.id } })

		return result
	}
}
