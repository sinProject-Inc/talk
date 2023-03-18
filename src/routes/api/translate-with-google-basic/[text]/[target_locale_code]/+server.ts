import { LocaleCode } from '$lib/locale/locale_code'
import { TranslationText } from '$lib/translation/translation_text'
import { Translate } from '@google-cloud/translate/build/src/v2'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		const target_locale_code = new LocaleCode(params.target_locale_code)

		const translate = new Translate()
		const [translations] = await translate.translate(
			translation_text.text,
			target_locale_code.code
		)

		if(!translations) {
			return json('')
		}

		return json(translations)
	} catch (error) {
		console.error(error)
		return json('')
	}
}
