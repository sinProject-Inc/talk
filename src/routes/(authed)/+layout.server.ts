import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `/sign-in?redirect_url=${url.pathname}`)
	}
}
