import { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } from '$env/static/private'
import { AppLocale } from '$lib/value/value_object/string_value_object/app_locale'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const trimmed_text = params.text?.trim() ?? ''

	if (trimmed_text === '') return json('')

	const source_lang_code = params.source_lang_code?.trim() ?? 'en'
	const target_lang_code = params.target_lang_code?.trim() ?? 'en'

	const source_app_locale = AppLocale.create(source_lang_code)
	const target_app_locale = AppLocale.create(target_lang_code)

	const translationClient = new TranslationServiceClient()

	const glossaryConfig = {
		glossary: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/glossaries/glossary`,
	}

	console.log('target_language_code', target_app_locale.toString)

	const request = {
		parent: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}`,
		contents: [trimmed_text],
		mimeType: 'text/plain',
		sourceLanguageCode: source_app_locale.toString(),
		targetLanguageCode: target_app_locale.toString(),
		glossaryConfig,
	}

	const [response] = await translationClient.translateText(request)

	if (response.glossaryTranslations) {
		return json(response.glossaryTranslations[0].translatedText)
	} else {
		return json('')
	}
}
