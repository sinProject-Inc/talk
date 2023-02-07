import { LocalesApi } from '$lib/language/locales_api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const locales = await new LocalesApi(url.origin).fetch()

	return { 
		locales: JSON.stringify(locales)
	}
}
