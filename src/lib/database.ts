import { PrismaClient, type Language, type Locale, type Sound, type Text, type User } from '@prisma/client'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const db = new PrismaClient()
export class Database {
	public static async get_texts(language_code: string): Promise<Text[]> {
		const texts = await db.text.findMany({
			where: { language: { code: language_code } },
			orderBy: { updated_at: 'desc' },
		})

		return texts
	}

	public static async sound_upsert(locale_code: string, sound_text: string): Promise<Sound> {
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

	public static async language_find_by_code(code: string): Promise<Language | null> {
		const language = await db.language.findUnique({ where: { code } })

		return language
	}

	public static async text_find_by_id(id: number): Promise<Text | null> {
		const text = await db.text.findUnique({ where: { id } })

		return text
	}

	public static async text_upsert(language_code: string, text: string): Promise<Text> {
		const language = await this.language_find_by_code(language_code)

		if (!language) throw new Error('language not found')

		const language_id = language.id

		const result = await db.text.upsert({
			where: {
				language_id_text: {
					language_id,
					text,
				},
			},
			update: { updated_at: new Date() },
			create: { language_id, text },
		})

		return result
	}

	public static async find_translation(
		text_id: number,
		language_code: string
	): Promise<Text[]> {
		const text = await this.text_find_by_id(text_id)
		const language = await this.language_find_by_code(language_code)

		if (!text) throw new Error('text not found')
		if (!language) throw new Error('language not found')

		const text_ids: number[] = []

		const translation_to = await db.textToText.findMany({
			where: {
				text_id_1: text_id,
				text_2: { language_id: language.id },
			},
		})

		translation_to.forEach((t) => text_ids.push(t.text_id_2))

		const translation_from = await db.textToText.findMany({
			where: {
				text_id_2: text_id,
				text_1: { language_id: language.id },
			},
		})

		translation_from.forEach((t) => text_ids.push(t.text_id_1))

		const texts = await db.text.findMany({
			where: {
				id: {
					in: text_ids,
				},
			},
			orderBy: { updated_at: 'desc' },
		})

		return texts
	}

	public static async add_translation(text_id: number, language_code: string, translation: string): Promise<Text> {
		const text = await this.text_find_by_id(text_id)
		const language = await this.language_find_by_code(language_code)

		if (!text) throw new Error('text not found')
		if (!language) throw new Error('language not found')

		const translation_text = await this.text_upsert(language_code, translation)

		await db.textToText.upsert({
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

	public static async find_user(email: string, can_register = true): Promise<User | undefined> {
		const user = await db.user.findUnique({ where: { email } })

		if (user) return user
		if (!can_register) return undefined

		try {
			return await db.user.create({
				data: {
					role: { connect: { name: Roles.user } },
					email,
				},
			})
		} catch (error) {
			console.error(error)
			return undefined
		}
	}

	public static async get_app_setting_int(key: string): Promise<number> {
		const appSetting = await db.appSetting.findUnique({ where: { key } })
		const number_value = Number(appSetting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		return number_value_not_nan
	}
}
