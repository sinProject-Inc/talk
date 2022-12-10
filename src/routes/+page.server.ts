import { Database } from '$lib/database'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const languages = await Database.language_find_many()
	const languages_json_string = JSON.stringify(languages)

	return {
		languages_json_string,
	}
}
