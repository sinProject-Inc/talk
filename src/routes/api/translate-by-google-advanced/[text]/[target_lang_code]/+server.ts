import { GOOGLE_PROJECT_ID } from '$env/static/private'
import { AppLocaleCode } from '$lib/language/app_locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		const target_app_locale_code = new AppLocaleCode(params.target_lang_code)

		const translationClient = new TranslationServiceClient()

		const request = {
			parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
			contents: [translation_text.text],
			mimeType: 'text/plain',
			// sourceLanguageCode: 'XX',
			targetLanguageCode: target_app_locale_code.code,
		}

		const [response] = await translationClient.translateText(request)

		if (response.translations) {
			return json(response.translations[0].translatedText)
		}
		else {
			return json('')
		}
	}
	catch (error) {
		console.error(error)
		return json('')
	}

}
