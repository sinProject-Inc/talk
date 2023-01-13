import { AppLocale } from "$lib/value/value_object/string_value_object/app_locale";
import { Translate } from "@google-cloud/translate/build/src/v2";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const trimmed_text = params.text?.trim() ?? ''

	if (trimmed_text === '') return json('')

	const target_lang = params.target_lang?.trim() ?? 'en'
	const target_app_locale = AppLocale.create(target_lang)

	const translate = new Translate()
	const [translations] = await translate.translate(trimmed_text, target_app_locale.toString())

	return json(translations)
}