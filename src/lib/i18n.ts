import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'
import { AppLocale } from './value/value_object/string_value_object/app_locale'

const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('ja', () => import('../locales/ja.json'))
register('zh-TW', () => import('../locales/zh-TW.json'))
register('ko', () => import('../locales/ko.json'))
register('km', () => import('../locales/km.json'))

function get_initial_locale(): AppLocale {
	if (!browser) return AppLocale.default

	const current_locale = localStorage.getItem('language_from') || window.navigator.language
	const app_locale = AppLocale.create(current_locale)

	return app_locale
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: get_initial_locale().toString(),
})
