import type { LocaleCode } from '../../language/locale_code'

export class GoogleVoice {
	private readonly _google_voice: undefined

	public static readonly english_united_states = new GoogleVoice('en-US-Neural2-J')
	public static readonly english_great_britain = new GoogleVoice('en-GB-Neural2-B')
	public static readonly japanese_japan = new GoogleVoice('ja-JP-Wavenet-D')
	public static readonly cantonese_hongkong = new GoogleVoice('yue-HK-Standard-B')
	public static readonly korean_korea = new GoogleVoice('ko-KR-Wavenet-C')
	public static readonly spanish_spain = new GoogleVoice('es-ES-Neural2-F')
	public static readonly vietnamese_vietnam = new GoogleVoice('vi-VN-Wavenet-B')

	public static readonly values = [
		GoogleVoice.english_united_states,
		GoogleVoice.english_great_britain,
		GoogleVoice.japanese_japan,
		GoogleVoice.cantonese_hongkong,
		GoogleVoice.korean_korea,
		GoogleVoice.spanish_spain,
		GoogleVoice.vietnamese_vietnam
	]

	private constructor(private readonly _name: string) {}

	public static from_locale_code(locale_code: LocaleCode): GoogleVoice {
		if (locale_code.is_cantonese()) {
			return GoogleVoice.cantonese_hongkong
		}

		const found = GoogleVoice.values.find((v) => v._name.startsWith(locale_code.code))

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code.code}`)
		}

		return found
	}

	public get name(): string {
		return this._name
	}
}
