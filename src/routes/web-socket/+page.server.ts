import { LocalesApi } from '$lib/language/locales_api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
	const locales = await new LocalesApi(fetch).fetch()

	return {
		locales: JSON.stringify(locales),
	}
}
