import { LocaleCode } from '$lib/locale/locale_code'
import { DeeplTranslator } from '$lib/translation/deepl_translator'
import { TranslationText } from '$lib/translation/translation_text'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TargetLanguageCode } from 'deepl-node'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		// TODO: DeepLのAPIを使って翻訳する
		const target_locale_code = new LocaleCode(params.target_locale_code?.trim() ?? 'en-US')
		const deepl_translator = new DeeplTranslator(translation_text)
		const translated_text = await deepl_translator.translate(
			target_locale_code.code as TargetLanguageCode
		)

		return json(translated_text.text)
	} catch (error) {
		console.error(error)
		return json('')
	}
}
