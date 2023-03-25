import type { LocaleCode } from '../locale/locale_code'
import type { SpeechText } from '../speech/speech_text'
import type { Text } from '@prisma/client'
import type { TextRepository } from './text_repository'
import { logger } from '../app/logger'

export class GetTextService {
	public constructor(
		private readonly _text_repository: TextRepository,
		private readonly _locale_code: LocaleCode,
		private readonly _speech_text: SpeechText
	) {}

	public async execute(): Promise<Text> {
		const found_text = await this._text_repository.find(this._locale_code, this._speech_text)

		if (found_text) return found_text

		try {
			const saved_text = await this._text_repository.save(this._locale_code, this._speech_text)

			logger.info(`[database] text saved: ${saved_text.text}`)

			return saved_text
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('Unique constraint failed')) {
					logger.warn(`[database] text already saved: ${this._speech_text.text}`)
					return await this.execute()
				}
			}

			throw e
		}
	}
}
