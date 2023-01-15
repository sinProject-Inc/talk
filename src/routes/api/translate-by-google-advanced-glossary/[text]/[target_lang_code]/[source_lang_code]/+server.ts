import { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } from '$env/static/private'
import { AppLocaleCode } from '$lib/value/value_object/string_value_object/app_locale_code'
import { TranslationText } from '$lib/value/value_object/string_value_object/text_value_object/translation_text'
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
			contents: [translation_text.string],
			mimeType: 'text/plain',
			sourceLanguageCode: source_app_locale_code.string,
			targetLanguageCode: target_app_locale_code.string,
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
