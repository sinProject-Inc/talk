import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'
import type { SpeechLanguageCode } from './speech_language_code'

export class AppLocale extends StringValueObject {
	public app_locale!: PreferNominal

	public static readonly english = new AppLocale('en')
	public static readonly japanese = new AppLocale('ja')
	public static readonly chinese_taiwan = new AppLocale('zh-TW')
	public static readonly korean = new AppLocale('ko')
	public static readonly khmer = new AppLocale('km')

	public static readonly values = [
		AppLocale.english,
		AppLocale.japanese,
		AppLocale.chinese_taiwan,
		AppLocale.korean,
		AppLocale.khmer,
	]

	public static get default(): AppLocale {
		return AppLocale.english
	}

	private constructor(value: string) {
		super(value)
	}

	public static create(locale_code: string | undefined): AppLocale {
		if (!locale_code) {
			return AppLocale.default
			// throw new Error('locale_code is empty')
		}

		const language_code = locale_code.trim().toLowerCase().split('-')[0] ?? locale_code

		return new AppLocale(language_code)

		// const found = AppLocale.values.find((v) => v.toString() === language_code2)

		// if (!found) {
		// 	throw new Error(`invalid locale_code: ${locale_code}`)
		// }

		// return found
	}

	public static fromSpeechLanguageCode(speech_language_code: SpeechLanguageCode): AppLocale {
		const speech_language_code_string = speech_language_code.toString()
		const language_code =
			speech_language_code_string === 'yue' ? 'zh-TW' : speech_language_code_string

		return AppLocale.create(language_code)
	}
}
