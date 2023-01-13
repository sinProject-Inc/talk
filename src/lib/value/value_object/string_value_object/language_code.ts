import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'

export class LanguageCode extends StringValueObject {
	public language_code!: PreferNominal

	public static readonly english_united_states = new LanguageCode('en-US')
	public static readonly english_great_britain = new LanguageCode('en-GB')
	public static readonly japanese = new LanguageCode('ja-JP')
	public static readonly chinese_taiwan = new LanguageCode('zh-TW')
	public static readonly korean = new LanguageCode('ko-KR')
	public static readonly khmer = new LanguageCode('km-KH')

	public static readonly values = [
		LanguageCode.english_united_states,
		LanguageCode.english_great_britain,
		LanguageCode.japanese,
		LanguageCode.chinese_taiwan,
		LanguageCode.korean,
		LanguageCode.khmer,
	]

	private constructor(value: string) {
		super(value)
	}

	public static create(language_code: string | undefined): LanguageCode {
		if (!language_code) {
			throw new Error('language_code is empty')
		}

		const lc = language_code.trim().toLowerCase()
		const found = LanguageCode.values.find((v) => v.toString() === lc)

		if (!found) {
			throw new Error(`invalid language_code: ${language_code}`)
		}

		return found
	}

	public for_text(): string {
		return this._value === 'yue' ? 'zh-TW' : this._value
	}
}
