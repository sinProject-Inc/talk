import { LanguagesApi } from '$lib/language/languages_api'
import { LocalesApi } from '$lib/language/locales_api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const languages = await new LanguagesApi(url.origin).fetch()
	const locales = await new LocalesApi(url.origin).fetch()

	return { 
		languages: JSON.stringify(languages),
		locales: JSON.stringify(locales)
	}
}
