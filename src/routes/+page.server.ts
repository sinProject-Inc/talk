import { logger } from '$lib/app/logger'
import { LocalesApi } from '$lib/locale/locales_api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, fetch }) => {
	logger.info(`GET ${url}`)

	logger.debug('[main] debug')
	logger.verbose('[main] verbose')
	logger.info('[main] Load')
	logger.warn('[main] Warn test')
	logger.error('[main] Error', new Error('エラーやでー'))

	const locales = await new LocalesApi(fetch).fetch()

	return {
		locales: JSON.stringify(locales),
	}
}
