import '$lib/static/i18n' // Import to initialize. Important :)
import { waitLocale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
	await waitLocale()
}
