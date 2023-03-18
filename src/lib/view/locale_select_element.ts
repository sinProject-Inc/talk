import type { Locale } from "@prisma/client"

export class LocaleSelectElement {
	public constructor(
		private readonly _html_select_element: HTMLSelectElement,
		private readonly _locales: Locale[]
	) {}

	public append_options(): void {
		this._locales.forEach((locale) => {
			const option = document.createElement('option')

			option.value = locale.code
			option.textContent = `${locale.language} (${locale.country})`

			this._html_select_element.appendChild(option)
		})
	}
}
