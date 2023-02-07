export class DefaultLocales {
	private readonly _from_locale = localStorage.getItem('from_locale') ?? 'en-US'
	private readonly _to_locale = localStorage.getItem('to_locale') ?? 'ja-JP'

	public constructor(
		private readonly _from_locale_select_element: HTMLSelectElement,
		private readonly _to_locale_select_element: HTMLSelectElement
	) {}

	public load_storage(): void {
		this._from_locale_select_element.value = this._from_locale
		this._to_locale_select_element.value = this._to_locale
	}
}
