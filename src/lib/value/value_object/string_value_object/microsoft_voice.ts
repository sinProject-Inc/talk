import type { PreferNominal } from '$lib/value/value_object'
import { StringValueObject } from '../string_value_object'
import { LocaleCode } from './locale_code'

export class MicrosoftVoice extends StringValueObject {
	public microsoft_voice!: PreferNominal

	// Language and voice support for the Speech service
	// https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=stt-tts

	public static readonly english_united_states = new MicrosoftVoice('en-US-AriaNeural')
	public static readonly english_great_britain = new MicrosoftVoice('en-GB-AlfieNeural')
	public static readonly japanese_japan = new MicrosoftVoice('ja-JP-KeitaNeural')
	public static readonly cantonese_hongkong = new MicrosoftVoice('yue-CN-XiaoMinNeural')
	public static readonly korean_korea = new MicrosoftVoice('ko-KR-BongJinNeural')
	public static readonly khmer_cambodia = new MicrosoftVoice('km-KH-PisethNeural')

	public static readonly values = [
		MicrosoftVoice.english_united_states,
		MicrosoftVoice.english_great_britain,
		MicrosoftVoice.japanese_japan,
		MicrosoftVoice.cantonese_hongkong,
		MicrosoftVoice.korean_korea,
		MicrosoftVoice.khmer_cambodia,
	]

	private constructor(value: string) {
		super(value)
	}

	public static fromLocaleCode(locale_code: LocaleCode): MicrosoftVoice {
		if (locale_code.equals(LocaleCode.cantonese_hongkong)) {
			return MicrosoftVoice.cantonese_hongkong
		}

		const found = MicrosoftVoice.values.find((v) => v.string.startsWith(locale_code.string))

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code}`)
		}

		return found
	}
}
