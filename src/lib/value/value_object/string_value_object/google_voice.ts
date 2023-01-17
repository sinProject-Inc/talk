import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'
import { LocaleCode } from './locale_code'

export class GoogleVoice extends StringValueObject {
	public google_voice!: PreferNominal

	public static readonly english_united_states = new GoogleVoice('en-US-Neural2-J')
	public static readonly english_great_britain = new GoogleVoice('en-GB-Neural2-B')
	public static readonly japanese_japan = new GoogleVoice('ja-JP-Wavenet-D')
	public static readonly cantonese_hongkong = new GoogleVoice('yue-HK-Standard-B')
	public static readonly korean_korea = new GoogleVoice('ko-KR-Wavenet-C')

	public static readonly values = [
		GoogleVoice.english_united_states,
		GoogleVoice.english_great_britain,
		GoogleVoice.japanese_japan,
		GoogleVoice.cantonese_hongkong,
		GoogleVoice.korean_korea,
	]

	private constructor(value: string) {
		super(value)
	}

	public static fromLocaleCode(locale_code: LocaleCode): GoogleVoice {
		if (locale_code.equals(LocaleCode.cantonese_hongkong)) {
			return GoogleVoice.cantonese_hongkong
		}

		const found = GoogleVoice.values.find((v) => v.string.startsWith(locale_code.string))

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code}`)
		}

		return found
	}
}
