import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	const email = new Email(locals.user.email)

	const locales = await Repository.locale.find_many()
	const user = await Repository.user.find_unique(email)

	if (!user) throw new Error('user is null')

	const user_id = user.id

	return {
		user_id,
		locales: JSON.stringify(locales),
		room_id: params.room_id ?? 'lobby',
	}
}
