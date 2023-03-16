import { Repository } from '$lib/app/repository'
import type { RequestHandler } from '@sveltejs/kit'

const db = Repository.context


async function add_language_cantonese(): Promise<void> {
	await db.locale.create({ data: { code: 'yue-HK', name: '廣東話 (HK)' } })
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
	await db.locale.create({ data: { code: 'ko-KR', name: '한국어 (KR)' } })
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
	await db.locale.create({ data: { code: 'km-KH', name: 'ខ្មែរ (KH)' } })
	await db.language.create({ data: { code: 'km', name: 'ខ្មែរ' } })

	await db.text.create({ data: { language_id: 5, text: 'អរុណ​សួស្តី' } })
	await db.text.create({ data: { language_id: 5, text: 'សូមអរគុណ' } })
	await db.text.create({ data: { language_id: 5, text: 'រីករាយ​ដែល​បាន​ជួប​អ្នក' } })
}

async function add_language_spanish(): Promise<void> {
	await db.locale.create({ data: { code: 'es-ES', name: 'Español (ES)' } })
	await db.language.create({ data: { code: 'es', name: 'Español' } })

	await db.text.create({ data: { language_id: 6, text: 'Hola' } })
	await db.text.create({ data: { language_id: 6, text: '¿Qué tal?' } })
	await db.text.create({ data: { language_id: 6, text: 'Nos vemos' } })
	await db.text.create({ data: { language_id: 6, text: '¿Dónde está el baño?' } })
}

async function add_language_vietnamese(): Promise<void> {
	await db.locale.create({ data: { code: 'vi-VN', name: 'Tiếng Việt (VN)' } })
	await db.language.create({ data: { code: 'vi', name: 'Tiếng Việt' } })

	await db.text.create({ data: { language_id: 7, text: 'Chào buổi sáng' } })
	await db.text.create({ data: { language_id: 7, text: 'Rất vui được gặp bạn' } })
}

async function add_languages(): Promise<void> {
	await add_language_cantonese()
	await add_language_korean()
	await add_language_khmer()
	await add_language_spanish()
	await add_language_vietnamese()
}

export const GET: RequestHandler = async () => {
	try {
		await add_languages()

		return new Response('Success')
	} catch (error) {
		console.error(error)
		return new Response('Error')
	}
}
