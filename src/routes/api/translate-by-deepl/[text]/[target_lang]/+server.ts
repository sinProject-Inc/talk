import { DeeplTranslator } from '$lib/translation/deepl_translator'
import { TranslationText } from '$lib/translation/translation_text'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TargetLanguageCode } from 'deepl-node'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		// TODO: Translate to selected language #77
		const target_lang = (params.target_lang?.trim() ?? 'en') as TargetLanguageCode
		const deepl_translator = new DeeplTranslator(translation_text)
		const translated_text = await deepl_translator.translate(target_lang)

		return json(translated_text.text)
	} catch (error) {
		console.error(error)
		return json('')
	}
}
