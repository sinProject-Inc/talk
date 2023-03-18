import type { LocaleCode } from '$lib/locale/locale_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { Text } from '@prisma/client'
import type { TextRepository } from './text_repository'

export class GetTextService {
	public constructor(
		private readonly _text_repository: TextRepository,
		private readonly _locale_code: LocaleCode,
		private readonly _speech_text: SpeechText
	) {}

	public async execute(): Promise<Text> {
		const found_text = await this._text_repository.find(this._locale_code, this._speech_text)

		if (found_text) {
			// console.info('text found:', found_text.text)
			return found_text
		}

		try {
			const saved_text = await this._text_repository.save(this._locale_code, this._speech_text)

			console.info('text saved:', saved_text.text)
			return saved_text
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('Unique constraint failed')) {
					console.warn('text already saved:', this._speech_text.text)
					return await this.execute()
				}
			}

			throw e
		}
	}
}
