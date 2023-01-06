import { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } from '$env/static/private'
import { Lang } from '$lib/lang'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const trimmed_text = params.text?.trim() ?? ''

	if (trimmed_text === '') return json('')

	const source_lang_code = params.source_lang_code?.trim() ?? 'en'
	const target_lang_code = params.target_lang_code?.trim() ?? 'en'
	const target_lang_code2 = Lang.to_text_language_code(target_lang_code)

	const translationClient = new TranslationServiceClient()

	const glossaryConfig = {
		glossary: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/glossaries/glossary`,
	}

	console.log('target_language_code', target_lang_code2)

	const request = {
		parent: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}`,
		contents: [trimmed_text],
		mimeType: 'text/plain',
		sourceLanguageCode: source_lang_code,
		targetLanguageCode: target_lang_code2,
		glossaryConfig,
	}

	const [response] = await translationClient.translateText(request)

	if (response.glossaryTranslations) {
		return json(response.glossaryTranslations[0].translatedText)
	} else {
		return json('')
	}
}
