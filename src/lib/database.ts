import { PrismaClient, type Language, type Locale, type Sound, type Text } from '@prisma/client'

export const db = new PrismaClient()
export class Database {
	public static async get_texts(language_code: string): Promise<Text[]> {
		const texts = await db.text.findMany({ where: { language: { code: language_code } } })

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
				}
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
}
