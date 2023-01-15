import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'

export class SpeechLanguageCode extends StringValueObject {
	public speech_language_code!: PreferNominal

	public static readonly english = new SpeechLanguageCode('en')
	public static readonly japanese = new SpeechLanguageCode('ja')
	public static readonly yue_chinese = new SpeechLanguageCode('yue')
	public static readonly korean = new SpeechLanguageCode('ko')
	public static readonly khmer = new SpeechLanguageCode('km')

	public static readonly values = [
		SpeechLanguageCode.english,
		SpeechLanguageCode.japanese,
		SpeechLanguageCode.yue_chinese,
		SpeechLanguageCode.korean,
		SpeechLanguageCode.khmer,
	]

	private constructor(value: string) {
		super(value)
	}

	public static create(language_code: string | undefined): SpeechLanguageCode {
		const lower_case_language_code = language_code?.trim().toLowerCase() ?? ''

		if (!lower_case_language_code) {
			throw new Error('language_code is empty')
		}

		const found = SpeechLanguageCode.values.find((v) => v.string === lower_case_language_code)

		if (!found) {
			throw new Error(`invalid language_code: ${language_code}`)
		}

		return found
	}
}
