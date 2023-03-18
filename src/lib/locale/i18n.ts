import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const locales = [
	'en-US',
	'es-ES',
	'ja-JP',
	'km-KH',
	'ko-KR',
	'vi-VN',
	'yue-HK',
	'ar-XA',
	'cmn-CN',
	'cmn-TW',
	'it-IT',
	'de-DE',
	'fil-PH',
	'fr-FR',
	'ru-RU',
	'th-TH',
	'hi-IN',
	'id-ID',
	'pt-PT',
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
