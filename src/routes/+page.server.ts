import { db } from "$lib/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const languages = await db.language.findMany()
	const languages_json_string = JSON.stringify(languages)

	return {
		languages_json_string,
	}
}