import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'
import { Lang } from './lang'

const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('ja', () => import('../locales/ja.json'))
register('zh-TW', () => import('../locales/zh-TW.json'))

function get_initial_locale(): string {
	if (!browser) return defaultLocale

	const current_locale = localStorage.getItem('language_from') || window.navigator.language
	const text_language_code = Lang.to_text_language_code(current_locale)

	// console.log('get_initial_locale', current_locale, text_language_code)

	return text_language_code
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: get_initial_locale(),
})
