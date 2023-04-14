import { TextLimit } from '$lib/text/text_limit'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		TextLimit.from_string(param)
		return true
	} catch (e) {
		return false
	}
}) satisfies ParamMatcher
