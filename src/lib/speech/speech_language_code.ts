import type { LocaleCode } from "$lib/language/locale_code"

export class SpeechLanguageCode {
	private readonly _speech_language_code: undefined

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

	private constructor(private readonly _code: string) {}

	public static create(language_code: string | undefined): SpeechLanguageCode {
		const lower_case_language_code = language_code?.trim().toLowerCase() ?? ''

		if (!lower_case_language_code) {
			throw new Error('language_code is empty')
		}

		const found = SpeechLanguageCode.values.find((v) => v._code === lower_case_language_code)

		if (!found) {
			throw new Error(`invalid language_code: ${language_code}`)
		}

		return found
	}

	public static create_from_locale_code(locale_code: LocaleCode): SpeechLanguageCode {
		const language_code = locale_code.code.split('-')[0]
		const speech_language_code = SpeechLanguageCode.create(language_code)

		return speech_language_code
	}

	public get code(): string {
		return this._code
	}

	public equals(other: SpeechLanguageCode): boolean {
		return this._code === other._code
	}
}
