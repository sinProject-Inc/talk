
export class LocaleCode {
	private readonly _locale_code: undefined

	public static readonly english_united_states = new LocaleCode('en-US')
	public static readonly english_great_britain = new LocaleCode('en-GB')
	public static readonly japanese_japan = new LocaleCode('ja-JP')
	public static readonly cantonese_hongkong = new LocaleCode('yue-HK')
	public static readonly korean_korea = new LocaleCode('ko-KR')
	public static readonly khmer_cambodia = new LocaleCode('km-KH')
	public static readonly spanish_spain = new LocaleCode('es-ES')

	public static readonly values = [
		LocaleCode.english_united_states,
		LocaleCode.english_great_britain,
		LocaleCode.japanese_japan,
		LocaleCode.cantonese_hongkong,
		LocaleCode.korean_korea,
		LocaleCode.khmer_cambodia,
		LocaleCode.spanish_spain,
	]

	public static get default(): LocaleCode {
		return LocaleCode.english_united_states
	}

	private constructor(private readonly _code: string) {}

	public static create(locale_code: string | undefined): LocaleCode {
		if (!locale_code) {
			throw new Error('locale_code is empty')
		}

		const found = LocaleCode.values.find((v) => v._code === locale_code)

		if (!found) {
			throw new Error(`invalid locale_code: ${locale_code}`)
		}

		return found
	}

	public get code(): string {
		return this._code
	}

	private _equals(other: LocaleCode): boolean {
		return this._code === other._code
	}

	public is_cantonese(): boolean {
		return this._equals(LocaleCode.cantonese_hongkong)
	}

	private _is_khmer(): boolean {
		return this._equals(LocaleCode.khmer_cambodia)
	}

	public use_microsoft_speech(): boolean {
		return this._is_khmer()
	}

}
