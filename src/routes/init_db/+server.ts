import { db } from '$lib/database'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	try {
		await db.language.create({ data: { code: 'en', name: 'English' } })
		await db.language.create({ data: { code: 'ja', name: '日本語' } })

		await db.locale.create({ data: { code: 'en-US', name: 'English (United States)' } })
		await db.locale.create({ data: { code: 'ja-JP', name: '日本語 (日本)' } })

		await db.text.create({ data: { language_id: 2, text: 'こんにちは、世界！' } })

		await db.text.create({ data: { language_id: 1, text: 'This is heavy!' } }) // ヘビーだ！
		await db.text.create({ data: { language_id: 1, text: 'Nobody calls me Chicken.' } }) // 誰にも僕を「チキン」だとは言わせない。
		await db.text.create({ data: { language_id: 1, text: 'GREAT SCOTT!' } }) // なんてこった！
		await db.text.create({ data: { language_id: 1, text: 'All the best stuff is made in Japan.' } }) // 日本製の物はどれも最高だよ
		await db.text.create({
			data: {
				language_id: 1,
				text: 'If you put your mind to it, you can accomplish anything.',
			},
		}) // 何ごとも為せば成る。
		await db.text.create({
			data: { language_id: 1, text: "Roads? Where we're going we don't need roads." },
		}) // 道だって？我々がいくところに道なんていらない。

		await db.text.create({ data: { language_id: 1, text: 'May the Force be with you.' } }) // フォースと共にあらん事を
		await db.text.create({ data: { language_id: 1, text: "I'll be back." } }) // また戻ってくる
		await db.text.create({ data: { language_id: 1, text: "Don't think, just do." } }) // 考えるな、動け


		return new Response('Success')
	} catch (error) {
		console.error(error)
		return new Response('Error')
	}
}
