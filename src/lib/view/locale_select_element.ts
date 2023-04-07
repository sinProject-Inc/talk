import type { Locale } from '@prisma/client'

export class LocaleSelectElement {
	public constructor(
		private readonly _html_select_element: HTMLSelectElement,
		private readonly _locales: Locale[]
	) {}

	private _get_long_name(locale: Locale): string {
		return `${locale.language} ${locale.emoji}${locale.country}`
	}

	private _get_short_name(locale: Locale): string {
		const country_code = locale.code.split('-')[1]

		return `${locale.language} ${locale.emoji}${country_code}`
	}

	private _append_options(is_long_name: boolean): void {
		this._locales.forEach((locale) => {
			const option = document.createElement('option')

			option.value = locale.code

			option.textContent = is_long_name ? this._get_long_name(locale) : this._get_short_name(locale)

			this._html_select_element.appendChild(option)
		})
	}

	public append_options_long(): void {
		this._append_options(true)
	}

	public append_options_short(): void {
		this._append_options(false)
	}
}
