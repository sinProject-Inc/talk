import type { LocaleCode } from '../language/locale_code'
import { SpeechText } from '../speech/speech_text'
import type { Text } from '@prisma/client'
import { ApiPath } from '../api/api_path'

export class TextToSpeechUrl {
	public constructor(
		// TODO: Fix this
		private readonly _selected_text: Text | string,
		private readonly _locale_code: LocaleCode
	) {}

	public get url(): string {
		try {
			let speech_text: string

			if (typeof this._selected_text === 'string') {
				speech_text = this._selected_text
			} else {
				speech_text = this._selected_text.text
			}
			
			const api_path = ApiPath.api_directory
				.connect('text-to-speech')
				.connect_with_encoding(speech_text)
				.connect(this._locale_code.code)

			return api_path.get_url()
		} catch (error) {
			console.error(error)
			return ''
		}
	}
}
