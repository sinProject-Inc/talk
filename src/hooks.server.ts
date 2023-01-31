import { Session } from '$lib/auth/session'
import { AuthTokenDb } from '$lib/auth/auth_token_db'
import { Signing } from '$lib/auth/signing'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const session = new Session(event.cookies) 

	if (!session.id) return await resolve(event)

	const auth_token_db = new AuthTokenDb()
	const auth_token = await auth_token_db.find(session)
	if (!auth_token) return await resolve(event)

	await Signing.access_valid(auth_token, event.cookies)

	event.locals.user = {
		email: auth_token.user.email,
		role: auth_token.user.role.name,
	}

	return await resolve(event)
}
