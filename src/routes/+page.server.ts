import { Api } from '$lib/api/api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const api = new Api(url.origin)
	const languages = await api.languages()
	const locales = await api.locales()

	return { 
		languages: JSON.stringify(languages),
		locales: JSON.stringify(locales)
	}
}
