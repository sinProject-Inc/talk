import * as deepl from 'deepl-node'
import { DEEPL_AUTH_KEY } from '$env/static/private'
import type { SourceLanguageCode, TargetLanguageCode } from 'deepl-node'

export class DeepL {
	public static async translate(text: string, target_lang: TargetLanguageCode, source_lang: SourceLanguageCode | null = null): Promise<string> {
		const translator = new deepl.Translator(DEEPL_AUTH_KEY)
		const result = await translator.translateText(text, source_lang, target_lang, { splitSentences: 'off'})

		console.info(`DeepL: ${text} -> ${result.text}`)

		return result.text
	}
}
