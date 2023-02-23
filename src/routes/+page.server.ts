import { LanguagesApi } from '$lib/language/languages_api'
import { LocalesApi } from '$lib/language/locales_api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
	const languages = await new LanguagesApi(fetch).fetch()
	const locales = await new LocalesApi(fetch).fetch()

	return { 
		languages: JSON.stringify(languages),
		locales: JSON.stringify(locales)
	}
}
