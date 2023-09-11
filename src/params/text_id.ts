// import { logger } from '$lib/app/logger'
import { TextId } from '$lib/text/text_id'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		TextId.from_string(param)

		return true
	} catch (e) {
		// const { message } = e as Error
		// logger.warn(`[TextId] Failed to match: ${param}, message: ${message}`)
		return false
	}
}) satisfies ParamMatcher
