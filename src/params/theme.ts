import { Theme } from '@prisma/client'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	if (Object.values(Theme).includes(param as Theme)) {
		return true
	} else {
		return false
	}
}) satisfies ParamMatcher
