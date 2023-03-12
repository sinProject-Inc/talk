import { GOOGLE_PROJECT_ID } from '$env/static/private'
import { AppLocaleCode } from '$lib/language/app_locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		const target_app_locale_code = new AppLocaleCode(params.target_lang_code)

		const translation_client = new TranslationServiceClient()

		const request = {
			parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
			contents: [translation_text.text],
			mimeType: 'text/plain',
			// sourceLanguageCode: 'XX',
			targetLanguageCode: target_app_locale_code.code,
		}

		const [response] = await translation_client.translateText(request)
		if (!response.translations) {
			return json('')
		}

		const translated_text_string = response.translations[0].translatedText

		if (!translated_text_string) {
			return json('')
		}

		return json(translated_text_string)
	} catch (error) {
		console.error(error)
		return json('')
	}
}
