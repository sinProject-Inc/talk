import { App } from '$lib/app/app'
import type { RequestHandler } from '@sveltejs/kit'

const db = App.prisma_client

async function add_roles(): Promise<void> {
	await db.role.create({ data: { name: 'admin' } })
	await db.role.create({ data: { name: 'user' } })
}

async function add_app_settings(): Promise<void> {
	await db.appSetting.create({ data: { key: 'session_lifetime_sec', value: '600' } })
	await db.appSetting.create({ data: { key: 'pin_code_lifetime_sec', value: '300' } })
}

async function add_locales(): Promise<void> {
	await db.locale.create({ data: { code: 'en-US', name: 'English (US)' } })
	await db.locale.create({ data: { code: 'en-GB', name: 'English (GB)' } })
	await db.locale.create({ data: { code: 'ja-JP', name: '日本語 (JP)' } })
	await db.locale.create({ data: { code: 'yue-HK', name: '廣東話 (HK)' } })
	await db.locale.create({ data: { code: 'ko-KR', name: '한국어 (KR)' } })
	await db.locale.create({ data: { code: 'km-KH', name: 'ខ្មែរ (KH)' } })
	await db.locale.create({ data: { code: 'es-ES', name: 'Español (ES)' } })
}

async function add_language_english(): Promise<void> {
	await db.language.create({ data: { code: 'en', name: 'English' } })

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
}

async function add_language_japanese(): Promise<void> {
	await db.language.create({ data: { code: 'ja', name: '日本語' } })
	await db.text.create({ data: { language_id: 2, text: 'こんにちは、世界！' } })
}

async function add_language_cantonese(): Promise<void> {
	await db.language.create({ data: { code: 'yue', name: '廣東話' } })

	await db.text.create({ data: { language_id: 3, text: '早上好。' } })

	await db.text.create({ data: { language_id: 3, text: '憑自我' } })
	await db.text.create({ data: { language_id: 3, text: '硬漢子' } })
	await db.text.create({ data: { language_id: 3, text: '挨出一身痴' } })

	await db.text.create({ data: { language_id: 3, text: '流汗血' } })
	await db.text.create({ data: { language_id: 3, text: '盡赤心' } })
	await db.text.create({ data: { language_id: 3, text: '追尋大意義' } })
	await db.text.create({ data: { language_id: 3, text: '生命' } })
	await db.text.create({ data: { language_id: 3, text: '作賭注' } })
	await db.text.create({ data: { language_id: 3, text: '留下了' } })
	await db.text.create({ data: { language_id: 3, text: '英雄故事' } })

	await db.text.create({ data: { language_id: 3, text: '憂患' } })
	await db.text.create({ data: { language_id: 3, text: '見骨氣' } })
	await db.text.create({ data: { language_id: 3, text: '昂歩顧分似醒獅！' } })

	await db.text.create({ data: { language_id: 3, text: '衝前去' } })
	await db.text.create({ data: { language_id: 3, text: '全部得失只有寸心知' } })
	await db.text.create({ data: { language_id: 3, text: '跨歩上' } })
	await db.text.create({ data: { language_id: 3, text: '雲上我要去寫' } })
	await db.text.create({ data: { language_id: 3, text: '名字！' } })
}

async function add_language_korean(): Promise<void> {
	await db.language.create({ data: { code: 'ko', name: '한국어' } })

	await db.text.create({ data: { language_id: 4, text: '사랑 해요.' } })
	await db.text.create({ data: { language_id: 4, text: '내 가치를 네가 정하지 마' } })
	await db.text.create({ data: { language_id: 4, text: '소신 있게 살다' } })
	await db.text.create({ data: { language_id: 4, text: '지금 한 번?' } })
	await db.text.create({
		data: { language_id: 4, text: '지금만 한 번, 마지막으로 한 번, 또, 또 한 번!' },
	})
	await db.text.create({ data: { language_id: 4, text: '휘둘리지 마. 너는 네 편이면 돼.' } })
	await db.text.create({
		data: { language_id: 4, text: '네가 너인 것에 다른 사람을 납득시킬 필요 없어' },
	})
	await db.text.create({ data: { language_id: 4, text: '살아만 있다면 뭐든 별거 아니야' } })
}

async function add_language_khmer(): Promise<void> {
	await db.language.create({ data: { code: 'km', name: 'ខ្មែរ' } })

	await db.text.create({ data: { language_id: 5, text: 'អរុណ​សួស្តី' } })
	await db.text.create({ data: { language_id: 5, text: 'សូមអរគុណ' } })
	await db.text.create({ data: { language_id: 5, text: 'រីករាយ​ដែល​បាន​ជួប​អ្នក' } })
}

async function add_language_spanish(): Promise<void> {
	await db.language.create({ data: { code: 'es', name: 'Español' } })

	await db.text.create({ data: { language_id: 6, text: 'Hola' } })
	await db.text.create({ data: { language_id: 6, text: '¿Qué tal?' } })
	await db.text.create({ data: { language_id: 6, text: 'Nos vemos' } })
	await db.text.create({ data: { language_id: 6, text: '¿Dónde está el baño?' } })
}

async function add_languages(): Promise<void> {
	await add_language_english()
	await add_language_japanese()
	await add_language_cantonese()
	await add_language_korean()
	await add_language_khmer()
	await add_language_spanish()
}

export const GET: RequestHandler = async () => {
	try {
		await add_roles()
		await add_app_settings()
		await add_locales()
		await add_languages()

		return new Response('Success')
	} catch (error) {
		console.error(error)
		return new Response('Error')
	}
}
