import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { TextLimit } from '$lib/text/text_limit'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }): Promise<Response> => {
	try {
		const locale_code = new LocaleCode(params.locale_code)
		const limit_string = url.searchParams.get('limit')
		const limit = limit_string ? TextLimit.from_string(limit_string) : undefined

		const texts = await Repository.text.find_many(locale_code, limit)
		const response = json(texts)

		return response
	} catch (error) {
		logger.error(`[database] Failed to find texts: ${params.locale_code}]`, error)
		return json({ error: (error as Error).message })
	}
}
