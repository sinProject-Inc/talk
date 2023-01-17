import type { LocaleCode } from './value/value_object/string_value_object/locale_code'
import type { SpeechSound } from './value/value_object/string_value_object/speech_sound'
import type { SpeechText } from './value/value_object/string_value_object/text_value_object/speech_text'

export abstract class Speech {
	public constructor(
		protected readonly _speech_text: SpeechText,
		protected readonly _locale_code: LocaleCode
	) {}

	public abstract speak(): Promise<SpeechSound>
}
