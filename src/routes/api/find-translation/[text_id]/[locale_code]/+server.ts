import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { TextId } from '$lib/text/text_id'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	try {
		const text_id = TextId.from_string(params.text_id)
		const locale_code = new LocaleCode(params.locale_code)
		const result = await Repository.translation.find_many(text_id, locale_code)

		return json(result)
	} catch (e) {
		logger.error(`[database] Failed to find translation: ${params.text_id}]`, e)
		return new Response((e as Error).message, { status: 400 })
	}
}
