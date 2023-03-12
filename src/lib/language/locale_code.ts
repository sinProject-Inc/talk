export class LocaleCode {
	public static readonly english_united_states = new LocaleCode('en-US', '&#x1f1fa;&#x1f1f8;')
	public static readonly english_great_britain = new LocaleCode('en-GB', '&#x1f1ec;&#x1f1e7;')
	public static readonly japanese_japan = new LocaleCode('ja-JP', '&#x1f1ef;&#x1f1f5;')
	public static readonly cantonese_hongkong = new LocaleCode('yue-HK', '&#x1f1ed;&#x1f1f0;')
	public static readonly korean_korea = new LocaleCode('ko-KR', '&#x1f1f0;&#x1f1f7;')
	public static readonly khmer_cambodia = new LocaleCode('km-KH', '&#x1f1f0;&#x1f1ed;')
	public static readonly spanish_spain = new LocaleCode('es-ES', '&#x1f1ea;&#x1f1f8;')
	public static readonly vietnamese_vietnam = new LocaleCode('vi-VN', '&#x1f1fb;&#x1f1f3;')

	public static readonly values = [
		LocaleCode.english_united_states,
		LocaleCode.english_great_britain,
		LocaleCode.japanese_japan,
		LocaleCode.cantonese_hongkong,
		LocaleCode.korean_korea,
		LocaleCode.khmer_cambodia,
		LocaleCode.spanish_spain,
		LocaleCode.vietnamese_vietnam,
	]

	public static get default(): LocaleCode {
		return LocaleCode.english_united_states
	}

	private constructor(private readonly _code: string, private readonly _html_code: string) {}

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

	public get html_code(): string {
		return this._html_code
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
