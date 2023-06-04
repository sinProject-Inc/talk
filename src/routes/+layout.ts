import '$lib/locale/i18n' // Import to initialize. Important :)
import { waitLocale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'
import { browser } from '$app/environment'
import { theme_service } from '$lib/theme/theme_service'

export const load: LayoutLoad = async ({ data }) => {
	await waitLocale()

	if (!browser) return

	const { theme } = data

	await theme_service.init_store(theme)
}
