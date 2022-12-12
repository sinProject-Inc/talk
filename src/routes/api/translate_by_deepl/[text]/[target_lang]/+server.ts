
import { DeepL } from '$lib/deepl'
import { json, type RequestHandler } from '@sveltejs/kit'
import type { TargetLanguageCode } from 'deepl-node'

export const GET: RequestHandler = async ({ url, params }) => {
	console.log(url.href)

	const trimmed_text = params.text?.trim() ?? ''
	// TODO: Translate to selected language #77
	const target_lang = (params.target_lang?.trim() ?? 'en') as TargetLanguageCode

	if (trimmed_text === '') return json('')

	const result_text = await DeepL.translate(trimmed_text, target_lang)

	return json(result_text)
}
