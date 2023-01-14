import { DeepL } from '$lib/deepl'
import { TranslationText } from '$lib/value/value_object/string_value_object/translation_text'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TargetLanguageCode } from 'deepl-node'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const translation_text = new TranslationText(params.text)
		// TODO: Translate to selected language #77
		const target_lang = (params.target_lang?.trim() ?? 'en') as TargetLanguageCode
		const result_text = await DeepL.translate(translation_text, target_lang)

		return json(result_text)
	} catch (error) {
		console.error(error)
		return json('')
	}
}
