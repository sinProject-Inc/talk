import { PrismaClient, type Language, type Sound, type Text } from '@prisma/client'

export const db = new PrismaClient()
export class Database {

	public static async get_texts(language_code: string): Promise<Text[]> {
		const texts = await db.text.findMany({ where: { language: { code: language_code } } })

		return texts
	}

	public static async sound_upsert(sound_text: string, locale_id: number): Promise<Sound> {
		const sound = await db.sound.upsert({
			where: {
				sound_text,
			},
			update: {},
			create: { locale_id, sound_text },
		})

		return sound
	}

	public static async sound_find_by_text(sound_text: string): Promise<Sound | null> {
		const sound = await db.sound.findUnique({ where: { sound_text } })

		return sound
	}

	public static async language_find_many(): Promise<Language[]> {
		const languages = await db.language.findMany()

		return languages
	}
}
