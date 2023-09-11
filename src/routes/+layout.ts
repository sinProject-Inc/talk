import '$lib/locale/i18n' // Import to initialize. Important :)
import { waitLocale, locale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'
import { browser } from '$app/environment'

export const load: LayoutLoad = async () => {
	if (!browser) return

	const stored_locale = localStorage.getItem('from_locale') ?? 'en-US'

	locale.set(stored_locale)

	await waitLocale(stored_locale)
}
