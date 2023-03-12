import type { LanguageRepository } from '$lib/language/language_repository'
import type { TextRepository } from '$lib/text/text_repository'
import type { PrismaClient, Text } from '@prisma/client'
import { LanguageRepositoryPrisma } from '../language/language_repository_prisma'
import type { SpeechLanguageCode } from '../speech/speech_language_code'
import type { SpeechText } from '../speech/speech_text'
import type { TextId } from '../text/text_id'
import { TextRepositoryPrisma } from '../text/text_repository_prisma'
import type { TranslationRepository } from './translation_repository'

export class TranslationRepositoryPrisma implements TranslationRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(text_id: TextId, speech_language_code: SpeechLanguageCode): Promise<Text[]> {
		const text_repository: TextRepository = new TextRepositoryPrisma(this._prisma_client)
		const text = await text_repository.find_by_id(text_id)
		const language_repository: LanguageRepository = new LanguageRepositoryPrisma(
			this._prisma_client
		)
		const language = await language_repository.find_unique(speech_language_code)

		if (!text) throw new Error('text not found')
		if (!language) throw new Error('language not found')

		const text_ids: number[] = []

		const translation_to = await this._prisma_client.textToText.findMany({
			where: {
				text_id_1: text_id.id,
				text_2: { language_id: language.id },
			},
		})

		translation_to.forEach((t) => text_ids.push(t.text_id_2))

		const translation_from = await this._prisma_client.textToText.findMany({
			where: {
				text_id_2: text_id.id,
				text_1: { language_id: language.id },
			},
		})

		translation_from.forEach((t) => text_ids.push(t.text_id_1))

		const texts = await this._prisma_client.text.findMany({
			where: {
				id: {
					in: text_ids,
				},
			},
			orderBy: { updated_at: 'desc' },
		})

		return texts
	}

	public async save(
		text_id: TextId,
		speech_language_code: SpeechLanguageCode,
		translation_speech_text: SpeechText
	): Promise<Text> {
		const text_repository: TextRepository = new TextRepositoryPrisma(this._prisma_client)
		const text = await text_repository.find_by_id(text_id)
		const language_repository: LanguageRepository = new LanguageRepositoryPrisma(
			this._prisma_client
		)
		const language = await language_repository.find_unique(speech_language_code)

		if (!text) throw new Error('text not found')
		if (!language) throw new Error('language not found')

		const translation_text = await text_repository.save(
			speech_language_code,
			translation_speech_text
		)

		await this._prisma_client.textToText.upsert({
			where: {
				text_id_1_text_id_2: {
					text_id_1: text.id,
					text_id_2: translation_text.id,
				},
			},
			update: {},
			create: {
				text_id_1: text.id,
				text_id_2: translation_text.id,
			},
		})

		return translation_text
	}
}
