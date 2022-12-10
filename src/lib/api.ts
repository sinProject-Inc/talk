import type { Text } from '@prisma/client'

export class Api {
	public static async get_texts(language_code: string): Promise<Text[]> {
		const response = await fetch(`/api/text/${language_code}`)
		const texts = (await response.json()) as Text[]

		return texts
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
