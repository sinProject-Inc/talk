import { GOOGLE_LOCATION, GOOGLE_PROJECT_ID } from '$env/static/private'
import { logger } from '$lib/app/logger'
import { LocaleCode } from '$lib/locale/locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const translation_text = new TranslationText(params['text'])
		const source_locale_code = new LocaleCode(params['source_locale_code'])
		const target_locale_code = new LocaleCode(params['target_locale_code'])

		const translation_client = new TranslationServiceClient()

		const glossary_config = {
			glossary: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/glossaries/glossary`,
		}

		const request = {
			parent: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}`,
			contents: [translation_text.text],
			mimeType: 'text/plain',
			sourceLocaleCode: source_locale_code.code,
			targetLocaleCode: target_locale_code.code,
			glossaryConfig: glossary_config,
		}

		const [response] = await translation_client.translateText(request)

		if (response.glossaryTranslations) {
			if (!response.glossaryTranslations[0]) return json('')

			return json(response.glossaryTranslations[0].translatedText)
		} else {
			return json('')
		}
	} catch (error) {
		logger.error(`[Google] Failed to translate: ${params['text']}]`, error)

		return json('')
	}
}
