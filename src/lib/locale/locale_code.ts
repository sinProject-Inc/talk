export class LocaleCode {
	public static readonly english_united_states = new LocaleCode('en-US')
	public static readonly japanese_japan = new LocaleCode('ja-JP')

	private readonly _code: string

	public constructor(code: string | undefined) {
		if (!code) throw new Error('Code is required')
		if (!code.includes('-')) throw new Error('Code must contain a hyphen')

		this._code = code
	}

	public get code(): string {
		return this._code
	}
}
