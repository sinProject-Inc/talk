import type { LocaleCode } from "../../language/locale_code"

export class MicrosoftVoice {
	private readonly _microsoft_voice: undefined

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

	private constructor(private readonly _name: string) {}

	public static fromLocaleCode(locale_code: LocaleCode): MicrosoftVoice {
		if (locale_code.is_cantonese()) {
			return MicrosoftVoice.cantonese_hongkong
		}

		const found = MicrosoftVoice.values.find((v) => v._name.startsWith(locale_code.code))

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code.code}`)
		}

		return found
	}

	public get name(): string {
		return this._name
	}
}
