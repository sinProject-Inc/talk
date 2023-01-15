import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'

export class LocaleCode extends StringValueObject {
	public locale_code!: PreferNominal

	public static readonly english_united_states = new LocaleCode('en-US')
	public static readonly english_great_britain = new LocaleCode('en-GB')
	public static readonly japanese_japan = new LocaleCode('ja-JP')
	public static readonly cantonese_hongkong = new LocaleCode('yue-HK')
	public static readonly korean_korea = new LocaleCode('ko-KR')
	public static readonly khmer_cambodia = new LocaleCode('km-KH')

	public static readonly values = [
		LocaleCode.english_united_states,
		LocaleCode.english_great_britain,
		LocaleCode.japanese_japan,
		LocaleCode.cantonese_hongkong,
		LocaleCode.korean_korea,
		LocaleCode.khmer_cambodia,
	]

	public static get default(): LocaleCode {
		return LocaleCode.english_united_states
	}

	private constructor(value: string) {
		super(value)
	}

	public static create(locale_code: string | undefined): LocaleCode {
		if (!locale_code) {
			throw new Error('locale_code is empty')
		}

		const found = LocaleCode.values.find((v) => v.string === locale_code)

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code}`)
		}

		return found
	}

	public useMicrosoftSpeech(): boolean {
		return this.equals(LocaleCode.khmer_cambodia)
	}
}
