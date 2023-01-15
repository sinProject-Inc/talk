import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'
import type { SpeechLanguageCode } from './speech_language_code'

export class AppLocaleCode extends StringValueObject {
	public app_locale_code!: PreferNominal

	public static readonly english = new AppLocaleCode('en')
	public static readonly japanese = new AppLocaleCode('ja')
	public static readonly chinese_taiwan = new AppLocaleCode('zh-TW')
	public static readonly korean = new AppLocaleCode('ko')
	public static readonly khmer = new AppLocaleCode('km')

	public static readonly values = [
		AppLocaleCode.english,
		AppLocaleCode.japanese,
		AppLocaleCode.chinese_taiwan,
		AppLocaleCode.korean,
		AppLocaleCode.khmer,
	]

	public static get default(): AppLocaleCode {
		return AppLocaleCode.english
	}

	public constructor(value: string | undefined) {
		const trimmed_locale_code = value?.trim() ?? ''

		if (!trimmed_locale_code) {
			return AppLocaleCode.default
			// throw new Error('locale_code is empty')
		}

		const language_code = trimmed_locale_code.toLowerCase().split('-')[0]

		super(language_code)
	}

	public static fromSpeechLanguageCode(speech_language_code: SpeechLanguageCode): AppLocaleCode {
		const speech_language_code_string = speech_language_code.string
		const language_code =
			speech_language_code_string === 'yue' ? 'zh-TW' : speech_language_code_string

		return new AppLocaleCode(language_code)
	}
}
