import type { PrismaClient, Text } from '@prisma/client'
import type { LocaleCode } from '../locale/locale_code'
import type { LocaleRepository } from '../locale/locale_repository'
import { LocaleRepositoryPrisma } from '../locale/locale_repository_prisma'
import type { SpeechText } from '../speech/speech_text'
import type { TextId } from '../text/text_id'
import type { TextRepository } from '../text/text_repository'
import { TextRepositoryPrisma } from '../text/text_repository_prisma'
import type { TranslationRepository } from './translation_repository'

export class TranslationRepositoryPrisma implements TranslationRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(text_id: TextId, locale_code: LocaleCode): Promise<Text[]> {
		const text_repository: TextRepository = new TextRepositoryPrisma(this._prisma_client)
		const text = await text_repository.find_by_id(text_id)
		const locale_repository: LocaleRepository = new LocaleRepositoryPrisma(
			this._prisma_client
		)
		const locale = await locale_repository.find_unique(locale_code)

		if (!text) throw new Error('text not found')
		if (!locale) throw new Error('Locale not found')

		const text_ids: number[] = []

		const translation_to = await this._prisma_client.textToText.findMany({
			where: {
				text_id_1: text_id.id,
				text_2: { locale_id: locale.id },
			},
		})

		translation_to.forEach((t) => text_ids.push(t.text_id_2))

		const translation_from = await this._prisma_client.textToText.findMany({
			where: {
				text_id_2: text_id.id,
				text_1: { locale_id: locale.id },
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
		locale_code: LocaleCode,
		translation_speech_text: SpeechText
	): Promise<Text> {
		const text_repository: TextRepository = new TextRepositoryPrisma(this._prisma_client)
		const text = await text_repository.find_by_id(text_id)
		const locale_repository: LocaleRepository = new LocaleRepositoryPrisma(
			this._prisma_client
		)
		const locale = await locale_repository.find_unique(locale_code)

		if (!text) throw new Error('text not found')
		if (!locale) throw new Error('Locale not found')

		const translation_text = await text_repository.save(
			locale_code,
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
