import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'
import { AppLocaleCode } from './app_locale_code'

const locales = ['en', 'ja', 'zh-TW', 'ko', 'km', 'es', 'vi']
const default_locale = 'en'

locales.forEach((locale) => {
	register(locale, () => import(`../../locales/${locale}.json`))
})

function get_initial_app_locale_code(): AppLocaleCode {
	if (!browser) return AppLocaleCode.default

	const current_locale = localStorage.getItem('language_from') || window.navigator.language
	const app_locale_code = new AppLocaleCode(current_locale)

	return app_locale_code
}

init({
	fallbackLocale: default_locale,
	initialLocale: get_initial_app_locale_code().code,
})

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('get_initial_app_locale_code', () => {
		expect(get_initial_app_locale_code().code).toBe('en')
	})
}
