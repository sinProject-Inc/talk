import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'
import { expect, test } from 'vitest'
import { AppLocaleCode } from './app_locale_code'

const default_locale = 'en'

register('en', () => import('../../locales/en.json'))
register('ja', () => import('../../locales/ja.json'))
register('zh-TW', () => import('../../locales/zh-TW.json'))
register('ko', () => import('../../locales/ko.json'))
register('km', () => import('../../locales/km.json'))

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
	test('get_initial_app_locale_code', () => {
		expect(get_initial_app_locale_code().code).toBe('en1')
	})
}