import { TranslateWithGoogleAdvanced } from '$lib/translation/translate_with_google_advanced'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const translate_with_google_advanced = new TranslateWithGoogleAdvanced(
		params.text,
		params.target_lang_code
	)

	const translated_text = await translate_with_google_advanced.execute()

	return json(translated_text)
}
