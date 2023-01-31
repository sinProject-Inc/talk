import { CookiesManager } from '$lib/cookies_manager'
import { AuthTokenDb } from '$lib/auth/auth_token_db'
import { Signing } from '$lib/auth/signing'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const cookiesManager = new CookiesManager(event.cookies) 
	const session_id = cookiesManager.session_id
	if (!session_id) return await resolve(event)

	const auth_token_db = new AuthTokenDb()
	const auth_token = await auth_token_db.find(session_id)
	if (!auth_token) return await resolve(event)

	await Signing.access_valid(auth_token.id, event.cookies)

	event.locals.user = {
		email: auth_token.user.email,
		role: auth_token.user.role.name,
	}

	return await resolve(event)
}
