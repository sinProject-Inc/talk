import * as deepl from 'deepl-node'
import { DEEPL_AUTH_KEY } from '$env/static/private'
import type { SourceLanguageCode, TargetLanguageCode } from 'deepl-node'
import { TranslationText } from './value/value_object/string_value_object/text_value_object/translation_text'

export class DeepL {
	public static async translate(translation_text: TranslationText, target_language_code: TargetLanguageCode, source_language_code: SourceLanguageCode | null = null): Promise<TranslationText> {
		const translator = new deepl.Translator(DEEPL_AUTH_KEY)
		const result = await translator.translateText(translation_text.string, source_language_code, target_language_code, { splitSentences: 'off'})
		const translated_text = new TranslationText(result.text)

		console.info(`DeepL: ${translation_text} -> ${translated_text.string}`)

		return translated_text
	}
}
