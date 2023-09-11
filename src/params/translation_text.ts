// import { logger } from '$lib/app/logger'
import { TranslationText } from '$lib/translation/translation_text'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		new TranslationText(param)

		return true
	} catch (e) {
		// const { message } = e as Error
		// logger.warn(`[TranslationText] Failed to match: ${param}, message: ${message}`)
		return false
	}
}) satisfies ParamMatcher
