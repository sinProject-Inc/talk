import { PrismaClient, type Language, type Locale, type Sound, type Text } from '@prisma/client'

export const db = new PrismaClient()
export class Database {
	public static async get_texts(language_code: string): Promise<Text[]> {
		const texts = await db.text.findMany({ where: { language: { code: language_code } }, orderBy: { updated_at: 'desc' } })

		return texts
	}

	public static async sound_upsert(sound_text: string, locale_code: string): Promise<Sound> {
		const locale = await db.locale.findUnique({ where: { code: locale_code } })

		if (!locale) throw new Error('locale not found')

		const locale_id = locale.id

		const sound = await db.sound.upsert({
			where: {
				locale_id_sound_text: {
					locale_id,
					sound_text,
				},
			},
			update: {},
			create: { locale_id, sound_text },
		})

		return sound
	}

	public static async sound_find_by_text(
		sound_text: string,
		locale_code: string
	): Promise<Sound | null> {
		const sound = await db.sound.findFirst({
			where: { sound_text, locale: { code: locale_code } },
		})

		return sound
	}

	public static async language_find_many(): Promise<Language[]> {
		const languages = await db.language.findMany()

		return languages
	}

	public static async locale_find_many(): Promise<Locale[]> {
		const locales = await db.locale.findMany()

		return locales
	}

	public static async text_upsert(text: string, language_code: string): Promise<Text> {
		const language = await db.language.findUnique({ where: { code: language_code } })

		if (!language) throw new Error('language not found')

		const language_id = language.id

		const result = await db.text.upsert({
			where: {
				language_id_text: {
					language_id,
					text,
				},
			},
			update: {},
			create: { language_id, text },
		})

		return result
	}
}
