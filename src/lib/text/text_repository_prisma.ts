import type { LocaleCode } from '../locale/locale_code'
import type { PrismaClient, Text } from '@prisma/client'
import type { LocaleRepository } from '../locale/locale_repository'
import { LocaleRepositoryPrisma } from '../locale/locale_repository_prisma'
import type { SpeechText } from '../speech/speech_text'
import type { TextId } from './text_id'
import type { TextLimit } from './text_limit'
import type { TextRepository } from './text_repository'

export class TextRepositoryPrisma implements TextRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_by_id(text_id: TextId): Promise<Text | null> {
		const text = await this._prisma_client.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async find(locale_code: LocaleCode, speech_text: SpeechText): Promise<Text | null> {
		const locale = await this._prisma_client.locale.findUnique({
			where: {
				code: locale_code.code,
			},
		})

		if (!locale) throw new Error('Locale not found')

		const text = await this._prisma_client.text.findUnique({
			where: {
				locale_id_text: {
					locale_id: locale.id,
					text: speech_text.text,
				},
			},
		})

		return text
	}

	public async find_many(locale_code: LocaleCode, limit?: TextLimit): Promise<Text[]> {
		const texts = await this._prisma_client.text.findMany({
			where: { locale: { code: locale_code.code } },
			orderBy: { updated_at: 'desc' },
			...(limit && { take: limit.limit }),
		})

		return texts
	}

	public async find_unique(text_id: TextId): Promise<Text | null> {
		const text = await this._prisma_client.text.findUnique({ where: { id: text_id.id } })

		return text
	}

	public async save(locale_code: LocaleCode, speech_text: SpeechText): Promise<Text> {
		const locale_repository: LocaleRepository = new LocaleRepositoryPrisma(this._prisma_client)
		const locale = await locale_repository.find_unique(locale_code)

		if (!locale) throw new Error('Locale not found')

		const locale_id = locale.id

		const result = await this._prisma_client.text.upsert({
			where: {
				locale_id_text: {
					locale_id: locale_id,
					text: speech_text.text,
				},
			},
			update: { updated_at: new Date() },
			create: { locale_id, text: speech_text.text },
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
