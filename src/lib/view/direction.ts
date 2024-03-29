export class Direction {
	public constructor(private readonly _locale: string) {}

	private _is_rtl(): boolean {
		return this._locale.startsWith('ar') || this._locale.startsWith('he')
	}

	public get value(): string {
		const value = this._is_rtl() ? 'rtl' : 'ltr'

		return value
	}
}
