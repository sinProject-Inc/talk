// import { logger } from '$lib/app/logger'
import { LocaleCode } from '$lib/locale/locale_code'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		new LocaleCode(param)
		return true
	} catch (e) {
		// const { message } = e as Error
		// logger.warn(`[LocaleCode] Failed to match: ${param}, message: ${message}`)
		return false
	}
}) satisfies ParamMatcher
