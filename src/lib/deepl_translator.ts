import * as deepl from 'deepl-node'
import { DEEPL_AUTH_KEY } from '$env/static/private'
import type { SourceLanguageCode, TargetLanguageCode } from 'deepl-node'
import { TranslationText } from './string/valid_text/translation_text'

export class DeeplTranslator {
	public constructor(private readonly _translation_text: TranslationText, private readonly _source_language_code: SourceLanguageCode | null = null) {}

	public async translate(target_language_code: TargetLanguageCode): Promise<TranslationText> {
		const translator = new deepl.Translator(DEEPL_AUTH_KEY)
		const result = await translator.translateText(
			this._translation_text.text,
			this._source_language_code,
			target_language_code,
			{ splitSentences: 'off' }
		)
		const translated_text = new TranslationText(result.text)

		console.info(`DeepL: ${this._translation_text.text} -> ${translated_text.text}`)

		return translated_text
	}
}
