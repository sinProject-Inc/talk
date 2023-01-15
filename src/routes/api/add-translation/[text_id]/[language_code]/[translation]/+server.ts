import { Database } from '$lib/database'
import { TextId } from '$lib/value/value_object/number_value_object/text_id'
import { SpeechLanguageCode } from '$lib/value/value_object/string_value_object/speech_language_code'
import { SpeechText } from '$lib/value/value_object/string_value_object/text_value_object/speech_text'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const text_id = TextId.from_string(params.text_id)
		const translation_speech_text = new SpeechText(params.translation)
		const speech_language_code = SpeechLanguageCode.create(params.language_code)
		const result = await Database.add_translation(
			text_id,
			speech_language_code,
			translation_speech_text
		)

		return json(result)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
