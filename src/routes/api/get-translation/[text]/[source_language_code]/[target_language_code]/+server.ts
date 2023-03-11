import type { Fetch } from '$lib/api/api'
import { Repository } from '$lib/app/repository'
import { AppLocaleCode } from '$lib/language/app_locale_code'
import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { TextId } from '$lib/text/text_id'
import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
import { TranslationText } from '$lib/translation/translation_text'
import type { Text } from '@prisma/client'
import { json, type RequestHandler } from '@sveltejs/kit'

async function get_text(
	speech_language_code: SpeechLanguageCode,
	speech_text: SpeechText
): Promise<Text> {
	const found_text = await Repository.text.find(speech_language_code, speech_text)

	if (found_text) {
		console.log('text found:', found_text.text)
		return found_text
	}

	try {
		const saved_text = await Repository.text.save(speech_language_code, speech_text)

		console.log('text saved:', saved_text.text)
		return saved_text
	} catch (e) {
		if (e instanceof Error) {
			if (e.message.includes('Unique constraint failed')) {
				console.warn('text already saved:', speech_text.text)
				return get_text(speech_language_code, speech_text)
			}
		}

		throw e
	}
}

async function get_translation(
	fetch: Fetch,
	text: Text,
	target_speech_language_code: SpeechLanguageCode
): Promise<Text[]> {
	const text_id = new TextId(text.id)

	const found_translations = await Repository.translation.find_many(
		text_id,
		target_speech_language_code
	)

	if (found_translations.length > 0) {
		console.log('translations found:', found_translations[0].text)
		return found_translations
	}

	const translation_text = new TranslationText(text.text)
	const target_app_locale_code = AppLocaleCode.from_speech_language_code(
		target_speech_language_code
	)

	const translated_text = await new TranslateWithGoogleAdvancedApi(
		translation_text,
		target_app_locale_code,
		fetch
	).fetch()

	const translated_speech_text = new SpeechText(translated_text.text)

	try {
		const saved_translation = await Repository.translation.save(
			text_id,
			target_speech_language_code,
			translated_speech_text
		)

		console.log('translation saved:', saved_translation.text)
		return [saved_translation]
	}
	catch (e) {
		if (e instanceof Error) {
			if (e.message.includes('Unique constraint failed')) {
				console.warn('translation already saved:', translated_speech_text.text)
				return get_translation(fetch, text, target_speech_language_code)
			}
		}

		throw e
	}
}

export const GET: RequestHandler = async ({ url, params, fetch }) => {
	console.info(url.href)

	try {
		const speech_text = new SpeechText(params.text)
		const source_speech_language_code = SpeechLanguageCode.create(params.source_language_code)
		const target_speech_language_code = SpeechLanguageCode.create(params.target_language_code)

		const text = await get_text(source_speech_language_code, speech_text)
		const translations = await get_translation(fetch, text, target_speech_language_code)

		return json(translations)
	} catch (e) {
		console.error(e)
		return new Response((e as Error).message, { status: 400 })
	}
}
