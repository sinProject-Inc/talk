import { base } from '$app/paths'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `${base}/sign-in?redirect_url=${url.pathname}`)
	}
}
