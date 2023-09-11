import { UserId } from '$lib/user/user_id'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): boolean => {
	try {
		UserId.from_string(param)

		return true
	} catch (e) {
		return false
	}
}) satisfies ParamMatcher
