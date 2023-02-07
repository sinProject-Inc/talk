import type { Language, Locale } from '@prisma/client'
import type { SpeechLanguageCode } from '../speech/speech_language_code'

export class Html {
	public static remove_children(html_element: HTMLElement): void {
		while (html_element.firstChild) {
			html_element.removeChild(html_element.firstChild)
		}
	}

	public static append_locale_select_options(
		html_select_element: HTMLSelectElement,
		locales: Locale[],
		language_code: SpeechLanguageCode
	): void {
		this.remove_children(html_select_element)

		console.info('language_code', language_code)

		locales
			.filter((locale) => locale.code.split('-')[0] === language_code.code)
			.forEach((locale) => {
				const option = document.createElement('option')

				option.value = locale.code
				option.textContent = locale.name.split(/[()]/)[1]

				option.setAttribute('language_code', locale.code.split('-')[0])

				html_select_element.appendChild(option)
			})
	}
}
