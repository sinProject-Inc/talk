import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'
import { AppLocaleCode } from './value/value_object/string_value_object/app_locale_code'

const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('ja', () => import('../locales/ja.json'))
register('zh-TW', () => import('../locales/zh-TW.json'))
register('ko', () => import('../locales/ko.json'))
register('km', () => import('../locales/km.json'))

function get_initial_locale(): AppLocaleCode {
	if (!browser) return AppLocaleCode.default

	const current_locale = localStorage.getItem('language_from') || window.navigator.language
	const app_locale_code = new AppLocaleCode(current_locale)

	return app_locale_code
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: get_initial_locale().string,
})
