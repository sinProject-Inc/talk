import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const locales = [
	'af-ZA',
	'id-ID',
	'ms-MY',
	'ca-ES',
	'da-DK',
	'de-DE',

	// 'en-AU',
	// 'en-GB',
	// 'en-IN',
	'en-US',

	'es-ES',
	'es-US',
	'eu-ES',

	'fil-PH',

	'fr-CA',
	'fr-FR',

	'gl-ES',
	'it-IT',
	'lv-LV',
	'lt-LT',
	'hu-HU',
	'nl-NL',
	'nb-NO',
	'pl-PL',

	'pt-BR',
	'pt-PT',

	'ro-RO',
	'sk-SK',
	'fi-FI',
	'sv-SE',
	'vi-VN',
	'tr-TR',

	'is-IS',
	'cs-CZ',
	'el-GR',
	'bg-BG',

	'ru-RU',
	'sr-RS',
	'uk-UA',

	'he-IL',
	'ar-XA',

	'mr-IN',
	'hi-IN',
	'bn-IN',
	'pa-IN',
	'gu-IN',
	'ta-IN',
	'te-IN',
	'kn-IN',
	'ml-IN',

	'th-TH',
	'km-KH',

	'cmn-TW',
	'yue-HK',
	'ja-JP',
	'cmn-CN',
	'ko-KR',
]
const default_locale = 'en-US'

locales.forEach((locale) => {
	register(locale, () => import(`../../locales/${locale}.json`))
})

function get_initial_locale_code(): string {
	if (!browser) return default_locale

	const current_locale = localStorage.getItem('language_from') || window.navigator.language

	return current_locale
}

init({
	fallbackLocale: default_locale,
	initialLocale: get_initial_locale_code(),
})

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('get_initial_app_locale_code', () => {
		expect(get_initial_locale_code()).toBe('en-US')
	})
}
