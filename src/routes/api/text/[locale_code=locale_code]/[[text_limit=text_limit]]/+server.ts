import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { TextLimit } from '$lib/text/text_limit'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	try {
		const locale_code = new LocaleCode(params.locale_code)
		const text_limit = TextLimit.from_string(params.text_limit ?? '100')

		const texts = await Repository.text.find_many(locale_code, text_limit)
		const response = json(texts)

		return response
	} catch (error) {
		logger.error(`[DB] Failed to find texts: ${params.locale_code}]`, error)

		return json({ error: (error as Error).message })
	}
}
