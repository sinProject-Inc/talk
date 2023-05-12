import { Repository } from '$lib/app/repository'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const locales = await Repository.locale.find_many()

	return {
		locales: JSON.stringify(locales),
		room_id: params.room_id ?? 'lobby',
	}
}
