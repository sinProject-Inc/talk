import type { Language } from "@prisma/client"

export class Html {
	public static append_language_select_options(
		html_select_element: HTMLSelectElement,
		languages: Language[]
	): void {
		languages.forEach((language) => {
			const option = document.createElement('option')

			option.textContent = language.name

			option.setAttribute('language_code', language.code)
			option.setAttribute('data-name', language.name)

			html_select_element.appendChild(option)
		})
	}
}