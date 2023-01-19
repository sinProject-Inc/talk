import { GOOGLE_PROJECT_ID } from '$env/static/private'
import { AppLocale } from '$lib/value/value_object/string_value_object/app_locale'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({url, params }) => {
	console.info(url.href)

	const trimmed_text = params.text?.trim() ?? ''

	if (trimmed_text === '') return json('')

	const target_lang_code = params.target_lang_code?.trim() ?? 'en'
	const app_locale = AppLocale.create(target_lang_code)

	const translationClient = new TranslationServiceClient()

	const request = {
		parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
		contents: [trimmed_text],
		mimeType: 'text/plain',
		// sourceLanguageCode: 'XX',
		targetLanguageCode: app_locale.toString(),
	}

	const [response] = await translationClient.translateText(request)

	if (response.translations) {
		return json(response.translations[0].translatedText)
	}
	else {
		return json('')
	}
}
