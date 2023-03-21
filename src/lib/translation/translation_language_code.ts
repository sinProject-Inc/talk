import type { LocaleCode } from '$lib/locale/locale_code'

export class TranslationLanguageCode {
	public constructor(private readonly _locale_code: LocaleCode) {}

	public get code(): string {
		if (this._locale_code.code.startsWith('ar')) return 'ar'
		if (this._locale_code.code.startsWith('yue-HK')) return 'cmn-HK'

		return this._locale_code.code
	}
}
