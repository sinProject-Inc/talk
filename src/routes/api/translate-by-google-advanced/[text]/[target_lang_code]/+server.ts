import { GOOGLE_PROJECT_ID } from '$env/static/private'
import { Lang } from '$lib/lang'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({url, params }) => {
	console.info(url.href)

	const trimmed_text = params.text?.trim() ?? ''

	if (trimmed_text === '') return json('')

	const target_lang_code = params.target_lang_code?.trim() ?? 'en'
	const target_lang_code2 = Lang.to_text_language_code(target_lang_code)

	const translationClient = new TranslationServiceClient()

	const request = {
		parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
		contents: [trimmed_text],
		mimeType: 'text/plain',
		// sourceLanguageCode: 'XX',
		targetLanguageCode: target_lang_code2,
	}

	const [response] = await translationClient.translateText(request)

	if (response.translations) {
		return json(response.translations[0].translatedText)
	}
	else {
		return json('')
	}
}
