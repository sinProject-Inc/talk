export class LocaleCode {
	public static readonly english_united_states = new LocaleCode('en-US')
	public static readonly japanese_japan = new LocaleCode('ja-JP')

	private readonly _code: string

	public constructor(code: string | undefined) {
		if (!code) throw new Error('LocaleCode is required')
		if (!code.includes('-')) throw new Error('LocaleCode must include a hyphen')

		const [language = '', country = ''] = code.split('-')

		if (!/^[a-z]{2,3}$/.test(language)) {
			throw new Error('Language code must be 2 or 3 lowercase letters')
		}

		if (!/^[A-Z]{2}$/.test(country)) {
			throw new Error('Country code must be 2 uppercase letters')
		}

		this._code = code
	}

	public get code(): string {
		return this._code
	}
}
