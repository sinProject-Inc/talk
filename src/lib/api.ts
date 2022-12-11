import type { Language, Locale, Text } from '@prisma/client'

export class Api {
	public constructor(private readonly _origin = '') {}

	private async _fetch<T>(path: string): Promise<T> {
		const response = await fetch(`${this._origin}${path}`)
		const result = (await response.json()) as T

		return result
	}

	public async texts(language_code: string): Promise<Text[]> {
		return await this._fetch<Text[]>(`/api/text/${language_code}`)
	}

	public async languages(): Promise<Language[]> {
		return await this._fetch<Language[]>('/api/languages')
	}

	public async locales(): Promise<Locale[]> {
		return await this._fetch<Locale[]>('/api/locales')
	}

	// HACK: 結合方法不明のため保留
	// async function split_sentences(text: string, url: URL): Promise<string[]> {
	// 	const split_response = await fetch(`${url.origin}/api/split-sentence/${text}`)
	// 	const sentences = (await split_response.json()) as string[]

	// 	return sentences
	// }

	// public static async split_sentences(text: string): Promise<string[]> {
	// 	const response = await fetch(`/api/split-sentence/${text}`)
	// 	const sentences = (await response.json()) as string[]

	// 	return sentences
	// }

	// public static async sound_upsert(sound_text: string, locale_id: number): Promise<number> {
	// 	const response = await fetch(`/api/sound-upsert/${sound_text}/${locale_id}`, { method: 'POST' })
	// 	const sound_id = await response.json()

	// 	return sound_id
	// }
}
