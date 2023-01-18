import { GOOGLE_LOCATION, GOOGLE_PROJECT_ID } from '$env/static/private'
import { AppLocaleCode } from '$lib/string/app_locale_code'
import { TranslationText } from '$lib/string/valid_text/translation_text'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		const source_app_locale_code = new AppLocaleCode(params.source_lang_code)
		const target_app_locale_code = new AppLocaleCode(params.target_lang_code)

		const translationClient = new TranslationServiceClient()

		const glossaryConfig = {
			glossary: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/glossaries/glossary`,
		}

		console.log('target_language_code', target_app_locale_code.toString)

		const request = {
			parent: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}`,
			contents: [translation_text.text],
			mimeType: 'text/plain',
			sourceLanguageCode: source_app_locale_code.code,
			targetLanguageCode: target_app_locale_code.code,
			glossaryConfig,
		}

		const [response] = await translationClient.translateText(request)

		if (response.glossaryTranslations) {
			return json(response.glossaryTranslations[0].translatedText)
		} else {
			return json('')
		}
	} catch (error) {
		console.error(error)
		return json('')
	}
}
