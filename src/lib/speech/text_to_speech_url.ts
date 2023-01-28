import type { LocaleCode } from '../language/locale_code'
import { SpeechText } from '../speech/speech_text'
import type { Text } from '@prisma/client'
import { ApiPath } from '../api/api_path'

export class TextToSpeechUrl {
	public constructor(
		private readonly _selected_text: Text,
		private readonly _locale_code: LocaleCode
	) {}

	public get url(): string {
		try {
			const speech_text = new SpeechText(this._selected_text.text)
			
			const api_path = ApiPath.api_directory
				.connect('text-to-speech')
				.connect_with_encoding(speech_text.text)
				.connect(this._locale_code.code)

			return api_path.get_url()
		} catch (error) {
			console.error(error)
			return ''
		}
	}
}
