import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'
import { Lang } from './lang'

const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('ja', () => import('../locales/ja.json'))
register('zh-TW', () => import('../locales/zh-TW.json'))

function get_initial_locale(): string {
	if (!browser) return defaultLocale

	const current_locale = localStorage.getItem('locale') || window.navigator.language
	const language_code = Lang.to_language_code(current_locale)

	return language_code
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: get_initial_locale(),
})
