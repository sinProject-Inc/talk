// import { logger } from '$lib/app/logger'
import { SpeechText } from '$lib/speech/speech_text'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		new SpeechText(param)
		return true
	} catch (e) {
		// const { message } = e as Error
		// logger.warn(`[SpeechText] Failed to match: ${param}, message: ${message}`)
		return false
	}
}) satisfies ParamMatcher
